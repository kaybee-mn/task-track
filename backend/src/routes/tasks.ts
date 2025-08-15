import { Prisma } from "@prisma/client";
import { createTask, getDailyTasks } from "../services/taskService";
import type { FastifyPluginAsync } from "fastify";
import { getNextDate } from "../lib/recurrenceUtil";

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

  fastify.get("/tasks/:date", async (request, reply) => {
    const userId = request.user.id;
    const tasks = await fastify.prisma.task.findMany({
      where: { userId, completed: false },
      include: { recurrenceInfo: true, sortingInfo: true },
    });
    const params = request.params as { date: string };
    const dailyTasks = await getDailyTasks(new Date(params.date), tasks);
    return reply.send(dailyTasks);
  });

  fastify.post("/tasks", async (request, reply) => {
    const userId = request.user.id;

    const task = await createTask(userId, request.body);
    return reply.send(task);
  });

  fastify.post("/tasks/complete/:id", async (request, reply) => {
    const userId = request.user.id;
    const body = request.body as { completed: boolean };
    const task = await fastify.prisma.task.findUnique({
      where: { id: request.id },
      include: {
        recurrenceInfo: true,
      },
    });

    if (!task || task.userId !== userId) {
      return reply
        .status(403)
        .send({ error: "Not authorized to update this task" });
    }
    // if no recurrence setting, mark task as complete

    if (!task.recurrence || !task.recurrenceInfo) {
      await fastify.prisma.task.update({
        where: {
          id: request.id,
        },
        data: {
          completed: true
        },
      });
      return;
    }

    // get next date

    const nextDate = getNextDate(task.recurrenceInfo);
    //if there is no next date, mark as complete (all completions have been finished)
    if (!nextDate) {
      await fastify.prisma.task.update({
        where: {
          id: request.id,
        },
        data: {
          completed: true,
        },
      });
      return;
    }

    if (!task.recurrenceInfo.fromLastCompletion) {
    }

    //last possible case - there are completions remaining
    // if fromLastCompletion, update lastCompletionDate to current date
    // if !fromLastCompletion, update lastCompletionDate to nextDate
    //if endType === 2, count = count-1
    const newData = {
      ...{
        lastCompletionDate: task.recurrenceInfo.fromLastCompletion
          ? new Date()
          : nextDate,
      },
      ...{
        end:
          task.recurrenceInfo.endType === 2 && task.recurrenceInfo.end
            ? task.recurrenceInfo.end - 1
            : null,
      },
    };
    fastify.prisma.recurrenceInfo.update({ where: { id: task.recurrenceInfo.id }, data:{...newData}});
    fastify.prisma.log.create({
      data: {
        type: "task",
        timestamp: new Date(),
        user: { connect: { id: userId } },
        task: {
          connect: { id: request.id },
        },
        note: "Completed Task: " + task.title,
      },
    });
  });
};

export default taskRoutes;
