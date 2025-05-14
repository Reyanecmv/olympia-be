import { FastifyReply, FastifyRequest } from "fastify";

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const passcode = request.headers['passcode'];
    console.log(request.headers)
    if(passcode === process.env.PASSCODE){
      request.userId = request.headers['userid'] as string
    }
  } catch (err) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
};
