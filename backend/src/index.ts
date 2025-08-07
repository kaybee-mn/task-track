import Fastify from "fastify";
import dotenv from "dotenv";
import { createSchedule } from "./routes/schedule";

import prismaPlugin from './plugins/prisma';
import authPlugin from './plugins/auth';
import tasksRoutes from './routes/tasks';
import authRoutes from "./routes/auth";
import moodRoutes from "./routes/mood";
import logRoutes from "./routes/logs";

dotenv.config();

export const fastify = Fastify({ logger: true });

await fastify.register(prismaPlugin);
await fastify.register(authPlugin);
await fastify.register(tasksRoutes);
await fastify.register(authRoutes);
await fastify.register(moodRoutes);
await fastify.register(logRoutes);

// run server on port 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    if (err) {
      // use fasify to log the error and end
      fastify.log.error(err);
      process.exit(1);
    }
  }
};
start();