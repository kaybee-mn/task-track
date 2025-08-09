import fastify from "fastify";
import { prisma } from "../lib/prisma";
import type { CreateTaskBody, RecurrenceInfo, Task } from "../types/taskTypes";
import {
  recurrenceInfoToRRule,
  stripTime,
  stripTimePlusOne,
} from "../lib/recurrenceUtil";

export async function createTask(userId: string, reqBody: any) {
  const body = reqBody as CreateTaskBody;

  const {
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
          ...recurrenceInfo,
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
  const task = await prisma.task.create(d);
  await prisma.log.create({
    data: {
      type: "task",
      timestamp: new Date(),
      user: { connect: { id: userId } },
      task: {
        connect: { id: task.id },
      },
      note: "New Task: " + task.title,
    },
  });
  return task;
}

export async function getDailyTasks(date: Date, tasks: Task[]) {
  const matchingTasks = tasks.filter((task) => {
    //if the task does not repeat
    if (!task.recurrence||!task.recurrenceInfo)
      return (
        stripTime(date).getTime() ===
        stripTime(new Date(task.startDate)).getTime()
      );
    try {
      const taskRule = recurrenceInfoToRRule(
        task.recurrenceInfo,
        stripTime(new Date(task.startDate)).getTime()
      );
      const occurrences = taskRule.between(
        stripTime(date),
        stripTimePlusOne(date),
        true // inclusive
      );
      return occurrences.length > 0;
    } catch (err) {
      console.error("Bad rrule:", task.recurrenceInfo, err);
      return false;
    }
  });
  return matchingTasks;
}
