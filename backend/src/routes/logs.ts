import { Prisma } from "@prisma/client";
import { getUserTasks } from "../services/tasks";
import type { FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
}

const logRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/logs", async (request, reply) => {
    const userId = request.user.id;
    const data = await fastify.prisma.log.findMany({ where: { userId } });
    return reply.send(data);
  });

  fastify.get("/log/recentMood", async (request, reply) => {
    const userId = request.user.id;

    const mood = await fastify.prisma.log.getMostRecentMood()
    console.log(mood)
    return reply.send(mood.timestamp);
  });
}

export default logRoutes;
