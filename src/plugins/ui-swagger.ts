import fastifySwaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp<FastifySwaggerUiOptions>(
  async (fastify) => {
    fastify.register(fastifySwaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => {
        // Remove the upgrade-insecure-requests directive
        return header.replace(/;\s*upgrade-insecure-requests/i, '');
      },
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });
  },
  { dependencies: ["@fastify/swagger"] },
);
