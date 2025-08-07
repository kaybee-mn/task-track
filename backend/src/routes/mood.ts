import { Prisma } from "@prisma/client";
import { getUserTasks } from "../services/tasks";
import type { FastifyPluginAsync } from "fastify";

type CreateMoodBody = {
  mood: number;
  notes?: string;
};
declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
}

const taskRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/mood", async (request, reply) => {
    const userId = request.user.id;
    const data = await fastify.prisma.mood.findMany({ where: { userId } });
    return reply.send(data);
  });

  fastify.post("/mood", async (request, reply) => {
    const userId = request.user.id;
    const body = request.body as CreateMoodBody;

    // create mood and log item to track when it was created
    const log = await fastify.prisma.log.create({
      data: {
        type: "mood",
        timestamp: new Date(),
        user: { connect: { id: userId } },
        mood: {
          create: {
              mood: body.mood,
              notes: body.notes ? body.notes : "",
              user: { connect: { id: userId } },
            
          },
        },
      },
    });

    return reply.send(log);
  });
};

export default taskRoutes;
