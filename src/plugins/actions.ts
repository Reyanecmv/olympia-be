import { asClass, asValue, Resolver } from "awilix";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { readdir } from "fs/promises";
import { join, parse } from "path";
import { Action, globalActionTypes } from "@app-types/app.js";

const actionsPath = join(process.cwd(), "src/actions");
const actions = new Map<string, Resolver<Action>>();

function createActionResolver<T extends Action>(
  ActionClass: new (...args: any[]) => T,
): Resolver<Action> {
  const resolver = asClass(ActionClass).singleton();
  if (!("resolve" in resolver && typeof resolver.resolve === "function")) {
    throw new Error("Invalid action resolver");
  }
  return resolver;
}

async function loadActionsRecursively(
  fastify: FastifyInstance,
  dir: string,
): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  const actionPromises = entries.map(async (entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await loadActionsRecursively(fastify, fullPath);
      return;
    }

    if (entry.name.startsWith("base") || !entry.name.endsWith(".action.js"))
      return;

    try {
      const module = await import(fullPath);
      const ActionClass = module.default || module[parse(entry.name).name];

      if (typeof ActionClass !== "function" || !ActionClass.prototype.execute) {
        fastify.log.warn(
          `Invalid action module: ${fullPath} - missing default export or execute method`,
        );
        return;
      }

      const actionName = ActionClass.name;
      const actionResolver = createActionResolver(ActionClass);
      actions.set(actionName, actionResolver);

      // Register this action type for TypeScript autocomplete
      globalActionTypes[actionName] = ActionClass;

      // Log successful action registration
      fastify.log.trace(`Registered action: ${actionName}`);
    } catch (error) {
      fastify.log.error(
        `Failed to load action from file: ${fullPath}. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  await Promise.all(actionPromises);
}

export default fp(
  async (fastify) => {
    await loadActionsRecursively(fastify, actionsPath);
    fastify.log.trace(`Loaded ${actions.size} actions`);
    fastify.diContainer.register("actions", asValue(actions));
    addActionsDecorator(fastify);
  },
  {
    dependencies: ["services", "@fastify/awilix"],
    name: "actions",
  },
);

const addActionsDecorator = (fastify: FastifyInstance) => {
  fastify.decorate("executeAction", async function <
    T extends string,
  >(actionName: T, params?: unknown) {
    const actions =
      fastify.diContainer.resolve<Map<string, Resolver<Action>>>("actions");
    const actionResolver = actions.get(actionName);
    if (!actionResolver) {
      throw new Error(`Action '${actionName}' not found`);
    }
    const action = fastify.diContainer.build(actionResolver);
    if (!action) {
      throw new Error(`Action '${actionName}' could not be built`);
    }
    return action.execute(params);
  });
};
