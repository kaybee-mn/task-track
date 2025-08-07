import { Prisma } from "@prisma/client";
import { getUserTasks } from "../services/taskService";
import type { FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
}

const taskRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/tasks", async (request, reply) => {
    const userId = request.user.id;
    const data = await fastify.prisma.task.findMany({ where: { userId } });
    return reply.send(data);
  });

  fastify.get("/tasks/daily", async (request, reply) => {
    const userId = request.user.id;
    const task = await getUserTasks(userId, request.body);
    const body = request.body as { date: Date };
    
    return reply.send(data);
  });

  fastify.post("/tasks", async (request, reply) => {
    const userId = request.user.id;

    const task = await getUserTasks(userId, request.body);
    return reply.send(task);
  });

  fastify.post("/tasks/complete/:id", async (request, reply) => {
    const userId = request.user.id;
    const body = request.body as { completed: boolean };
    const task = await fastify.prisma.task.findUnique({
      where: { id: request.id },
    });

    if (!task || task.userId !== userId) {
      return reply
        .status(403)
        .send({ error: "Not authorized to update this task" });
    }
    await fastify.prisma.task.update({
      where: {
        id: request.id,
      },
      data: {
        completed: body.completed,
      },
    });
    fastify.prisma.log.create({
      data: {
        type: "task",
        timestamp: new Date(),
        user: { connect: { id: userId } },
        task: {
          connect: { id: request.id },
        },
      },
    });
  });
};

export default taskRoutes;
