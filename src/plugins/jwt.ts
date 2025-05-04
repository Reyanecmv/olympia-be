import jwtConfig from "@config/jwt.js";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import { isCuid } from "@paralleldrive/cuid2";
import fp from "fastify-plugin";

export default fp<FastifyJWTOptions>(async (fastify) => {
  const { secret, algorithm, iss, allowedIss } = jwtConfig;

  fastify.register(fastifyJwt, {
    secret,
    sign: {
      algorithm,
      iss,
    },
    verify: {
      allowedIss,
    },
    trusted: (_request, decodedToken) => {
      return isCuid(decodedToken.jti);
    },
  });
});
