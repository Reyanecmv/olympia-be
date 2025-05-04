import { ServiceProvider } from "@utils/service-provider.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class HomeController {
  private constructor() {}

  static async index(_request: FastifyRequest, reply: FastifyReply) {
    reply.send({ message: "Hello, world!" });
  }

  static async show(request: FastifyRequest, reply: FastifyReply) {
    let dbStatus = "unknown";
    let redisStatus = "unknown";
    const { prismaClient } = ServiceProvider.getServices(request, [
      "prismaClient",
    ]);

    try {
      await prismaClient.$queryRaw`SELECT 1`;
      dbStatus = "up";
    } catch (error) {
      dbStatus = "down";
    }

    try {
      const pong = await request.server.redis.ping();
      redisStatus = pong === "PONG" ? "connected" : "disconnected";
    } catch (err) {
      redisStatus = "disconnected";
    }

    reply.send({
      status: "ok",
      uptime: process.uptime(),
      database: dbStatus,
      redis: redisStatus,
    });
  }
}
