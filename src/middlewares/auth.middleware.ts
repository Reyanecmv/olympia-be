import { FastifyReply, FastifyRequest } from "fastify";

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const passcode = request.headers['PASSCODE'];
    console.log(request.headers)
    if(passcode === process.env.PASSCODE){
      request.userId = request.headers['userId'] as string
    }
  } catch (err) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
};
