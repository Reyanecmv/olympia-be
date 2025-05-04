import { JWTToken } from "@app-types/auth/JWTToken.js";
import { FastifyReply, FastifyRequest } from "fastify";

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const claims: JWTToken = await request.jwtVerify();
    request.userId = claims.sub;
  } catch (err) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
};
