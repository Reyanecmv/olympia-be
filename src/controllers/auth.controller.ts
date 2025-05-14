import type {
  LoginRequest,
  RegisterRequest,
} from "@app-types/auth/index.js";
import { RefreshRequest } from "@app-types/auth/RefreshRequest.js";
import { init } from "@paralleldrive/cuid2";
import { ServiceProvider } from "@utils/service-provider.js";
import argon2 from "argon2";
import { FastifyReply, FastifyRequest } from "fastify";
import { DateTime } from "luxon";

export class AuthController {
  private constructor() {}

  static async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body;
    const { userService } = ServiceProvider.getServices(request, [
      "userService",
    ]);
    const user = await userService.fetchUser(email);

    if (!user) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    if (!(await argon2.verify(user.password, password))) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const expiresIn = DateTime.now();

    const createId = init({
      length: 32,
    });

    const token = await reply.jwtSign({
      sub: user.id,
      exp: expiresIn.plus({ day: 1 }).toUnixInteger(),
      jti: createId(),
    });
    const refreshToken = await reply.jwtSign({
      sub: user.id,
      exp: expiresIn.plus({ day: 7 }).toUnixInteger(),
      jti: createId(),
    });

    reply.send({ access_token: token, refresh_token: refreshToken });
  }

  static async register(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply,
  ) {
    const password = await argon2.hash(request.body.password);
    const { userService } = ServiceProvider.getServices(request, [
      "userService",
    ]);
    await userService.createUser({ ...request.body, password });

    reply.status(201).send({ message: "User created successfully" });
  }

  static async refresh(
    request: FastifyRequest<{ Body: RefreshRequest }>,
    reply: FastifyReply,
  ) {
    // const { refresh_token } = request.body;

    // const claims = request.server.jwt.verify<JWTToken>(refresh_token);

    // const isRefreshTokenUsed = await request.server.redis.get(
    //   `refresh:${claims.jti}`,
    // );

    // if (isRefreshTokenUsed) {
    //   return reply.status(400).send({ message: "Token already used" });
    // }

    // const expiresIn = DateTime.now();
    //
    // const createId = init({
    //   length: 32,
    // });

    // const accessToken = await reply.jwtSign({
    //   sub: claims.sub,
    //   exp: expiresIn.plus({ day: 1 }).toUnixInteger(),
    //   jti: createId(),
    // });
    // const refreshToken = await reply.jwtSign({
    //   sub: claims.sub,
    //   exp: expiresIn.plus({ day: 7 }).toUnixInteger(),
    //   jti: createId(),
    // });

    // try {
    //   await request.server.redis.set(
    //     `refresh:${claims.jti}`,
    //     JSON.stringify({ refreshed_at: DateTime.now() }),
    //     "EX",
    //     claims.exp,
    //   );
    //
    //   reply.send({ access_token: accessToken, refresh_token: refreshToken });
    // } catch (error) {
    //   reply
    //     .status(400)
    //     .send({ message: "An error has ocurred, please try again later" });
    // }
    return await reply.send({ message: "Logged out successfully" });
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    // const claims: JWTToken = await request.jwtVerify();

    // await request.server.redis.set(
    //   claims.jti,
    //   JSON.stringify({ sub: claims.sub, loggedOutAt: DateTime.now().toISO() }),
    //   "EX",
    //   claims.exp,
    // );

    return await reply.send({ message: "Logged out successfully" });
  }
}
