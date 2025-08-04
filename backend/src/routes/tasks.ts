import { getUserTasks } from "../services/tasks";
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
    const userId = request.user.id
    const data = await fastify.prisma.task.findMany({ where: { userId} });
    console.log(data);
    return reply.send(  data);
  });
};

export default taskRoutes;
