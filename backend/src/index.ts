import Fastify from "fastify";
import dotenv from "dotenv";
import { createSchedule } from "./routes/schedule";

import prismaPlugin from './plugins/prisma';
import authPlugin from './plugins/auth';
import tasksRoutes from './routes/tasks';

dotenv.config();

export const fastify = Fastify({ logger: true });

await fastify.register(prismaPlugin);
await fastify.register(authPlugin);
await fastify.register(tasksRoutes);

// run server on port 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    if (err) {
      // use fasify to log the error and end
      fastify.log.error(err);
      process.exit(1);
    }
  }
};
start();