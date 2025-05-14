import { AppOptions } from "@app-types/app.js";
import AutoLoad from "@fastify/autoload";
import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: AppOptions = {
  ignoreDuplicateSlashes: true,
  logger: {
    level: process.env.ENV_LEVEL || "debug",
    redact: ["headers.authorization"],
  },
};

const startServer = async () => {
  const app = Fastify(options);

  app.register(fastifyEnv, {
    dotenv: true,
    schema: {
      type: "object",
      required: ["JWT_SECRET", "DATABASE_URL"],
      properties: {
        JWT_SECRET: {
          type: "string",
        },
        DATABASE_URL: {
          type: "string",
        },
        ABACUS_USER: {
          type: "string",
        },
        ABACUS_PASSWORD: {
          type: "string",
        },
      },
    },
  });

  app.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options,
  });

  app.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options,
  });

  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await app.close();
        app.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        app.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  try {
    await app.listen({
      port: 3000,
      host: '0.0.0.0'
    });
    await app.ready();
    app.swagger();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
