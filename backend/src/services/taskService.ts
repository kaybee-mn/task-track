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
  const tasks = await prisma.task.create(d);
  return tasks;
}

export async function getDailyTasks(date: Date, tasks: Task[]) {
  const matchingTasks = tasks.filter((task) => {
    //if the task does not repeat
    if (!task.recurrence)
      return (
        stripTime(date).getTime() ===
        stripTime(new Date(task.startDate)).getTime()
      );
    try {
      const taskRule = recurrenceInfoToRRule(
        task.recurrenceInfo,
        stripTime(new Date(task.startDate)).getTime()
      );
      console.log(
        "rule: ",
        taskRule,
        "date: ",
        date,
        "datestart: ",
        stripTime(date),
        "dateend: ",
        stripTimePlusOne(date),
        "found: ",
        taskRule.between(
          stripTime(date),
          stripTimePlusOne(date),
          true // inclusive
        )
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
