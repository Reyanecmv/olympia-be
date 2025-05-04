import redisConfig from "@config/redis.js";
import fastifyRedis, { FastifyRedisPluginOptions } from "@fastify/redis";
import fp from "fastify-plugin";

export default fp<FastifyRedisPluginOptions>(async (fastify) => {
  const { host, port } = redisConfig;
  fastify.register(fastifyRedis, {
    host,
    port,
  });
});
