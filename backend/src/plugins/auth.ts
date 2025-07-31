import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtUserPayload {
  user_metadata: {
    sub: number;
  };
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

export default fp(async (fastify) => {
  fastify.decorate("authenticate", async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply.status(401).json({ error: "Missing or invalid header" });
      return;
    }
    const token = authHeader?.split(" ")[1];
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT secret not defined");
      }
      const payload = jwt.verify(token, secret) as JwtUserPayload;
      // make sure user is initialized
      request.user = request.user || {};
      // pass the user id
      request.user.id = payload.user_metadata.sub;
    } catch (err) {
      reply.status(403).json({ error: "Invalid token", err });
    }
  });
});
