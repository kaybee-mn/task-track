import { Prisma } from "@prisma/client";
import { getUserTasks } from "../services/taskService";
import type { FastifyPluginAsync } from "fastify";

type CreateMoodBody = {
  mood: number;
  note?: string;
};
type UpdateMoodBody = {
  note: string;
};
declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
}

const moodRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.put("/mood/:id", async (request, reply) => {
    const userId = request.user.id;
    const body = request.body as UpdateMoodBody;
    const params = request.params as { id: string };
    // make sure logged in user owns this mood
    const mood = await fastify.prisma.mood.findUnique({
      where: { id: params.id },
    });
    if (!mood || mood.userId !== userId) {
      return reply
        .status(403)
        .send({ error: "Not authorized to update this mood" });
    }
    //update mood with new note
    const data = await fastify.prisma.mood.update({
      where: { id: params.id },
      data: {
        notes: body.note,
      },
    });
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
            notes: body.note ? body.note : "",
            user: { connect: { id: userId } },
          },
        },
      },
    });

    return reply.send(log);
  });
};

export default moodRoutes;
