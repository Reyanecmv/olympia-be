import fastifyRateLimit, { FastifyRateLimitOptions } from "@fastify/rate-limit";
import fp from "fastify-plugin";

export default fp<FastifyRateLimitOptions>(async (fastify) => {
  fastify.register(fastifyRateLimit, {});
});
