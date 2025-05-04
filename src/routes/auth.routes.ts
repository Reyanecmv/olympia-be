import { AuthController } from "@controllers/auth.controller.js";
import {
  loginValidationSchema,
  logoutValidationSchema,
  registerValidationSchmea,
} from "@validators/auth/index.js";
import { refreshValidationSchema } from "@validators/auth/refresh.js";
import { FastifyPluginAsync } from "fastify";

const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post("/register", registerValidationSchmea, AuthController.register);
  fastify.post("/login", loginValidationSchema, AuthController.login);
  fastify.post("/logout", logoutValidationSchema, AuthController.logout);
  fastify.post("/refresh", refreshValidationSchema, AuthController.refresh);
};

export default auth;

export const autoPrefix = "/auth";
