import { HomeController } from "@controllers/home.controller.js";
import { healthChekSchema, indexSchema } from "@validators/home/index.js";
import { FastifyPluginAsync } from "fastify";

const home: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", indexSchema, HomeController.index);
  fastify.get("/health", healthChekSchema, HomeController.show);
};

export default home;
