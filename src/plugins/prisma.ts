import { PrismaClient } from "@prisma/client";
import { asValue } from "awilix";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const fastifyPrisma = async (fastify: FastifyInstance) => {
  fastify.diContainer.register("prismaClient", asValue(new PrismaClient()));
};

export default fp(async (fastify) => {
  fastifyPrisma(fastify);
});
