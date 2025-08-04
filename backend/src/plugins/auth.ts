import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseClientWithToken } from "./supabase";

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
      reply.status(401).send({ error: "Missing or invalid header" });
      return;
    }
    const token = authHeader?.split(" ")[1];
    try {
      const supabase = createSupabaseClientWithToken(token);
      // pass the user id
      const { data: { user }, error } = await supabase.auth.getUser();
      request.user = user;
    } catch (err) {
      console.error("JWT verification failed:", err);
      return reply.status(403).send({ error: "Invalid token", err });
    }
  });
});
