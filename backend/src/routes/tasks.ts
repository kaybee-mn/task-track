import { Prisma } from "@prisma/client";
import { getUserTasks } from "../services/tasks";
import type { FastifyPluginAsync } from "fastify";

type CreateTaskBody = {
  id: string;
  title: string;
  userId: string;
  recurrence: boolean; //if true, find recurrence info with matching id. if false, task is non-recurring
  description: string;
  startDate: Date;
  duration: number;
  recurrenceInfo: RecurrenceInfo;
  sortingInfo: SortingInfo;
};

export type RecurrenceInfo = {
  type: RecurrenceInfoType;
  freq: number; //example: how many days
  fromLastCompletion: boolean; //if true, next date is calculated from last day of completion. otherwise, from last due day
  lastCompletionDate?: Date;
  byDay?: string[]; //if weekly, string of weekdays: mo,tu,we,th,fr,sa,su. if monthly, days of month, if yearly, months
  endType: number; //if 1 or 2, end on end. if 0, never end
  end?: number; //if endType=1, number represents date of end, if 2, it is the amount of repeats remaining before end. if 0, no end
  bySetPos?: number; // e.g., 1 = first, 3 = third, -1 = last
};
export type RecurrenceInfoType =
  | "DAILY"
  | "MONTHLY"
  | "WEEKLY"
  | "HOURLY"
  | "MINUTELY"
  | "YEARLY"
  | "BYMONTHDAY";

export type SortingInfo = {
  create: {
    priority: number;
    difficulty: number;
    location: string;
  };
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

  fastify.get("/tasks", async (request, reply) => {
    const userId = request.user.id;
    const data = await fastify.prisma.task.findMany({ where: { userId } });
    return reply.send(data);
  });

  fastify.post("/tasks", async (request, reply) => {
    const userId = request.user.id;
    const body = request.body as CreateTaskBody;

    const {
      id,
      title,
      description,
      duration,
      recurrence,
      startDate,
      recurrenceInfo,
      sortingInfo,
    } = body;
    const d = {
      data: {
        title,
        description,
        duration,
        recurrence,
        startDate: startDate,
        ...(recurrence && {
          recurrenceInfo: {
            create: {
              ...recurrenceInfo,
            },
          },
        }),
        sortingInfo: {
          ...sortingInfo,
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    };
    console.log(d);
    const task = await fastify.prisma.task.create(d);
    return reply.send(task);
  });
};

export default taskRoutes;
