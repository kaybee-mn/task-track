import { prisma } from "../lib/prisma";
// import { Task } from "@prisma/client";

export async function getUserTasks(userId: string) {
    const tasks = await prisma.task.findMany({user_id:userId});
    return tasks;
}
