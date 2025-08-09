import { Prisma } from "@prisma/client";
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

  fastify.get("/logs/recentMood", async (request, reply) => {
    const userId = request.user.id;

    const mood = await fastify.prisma.log.findMany({
      where: { userId, type: "mood" },
      orderBy: {
        timestamp: "desc",
      },
      take: 1,
    });
    if(!mood[0]?.timestamp){
      return reply
        .status(403)
        .send({ error: "No moods!" });
    }
    return reply.send(mood[0].timestamp);
  });
};

export default logRoutes;
