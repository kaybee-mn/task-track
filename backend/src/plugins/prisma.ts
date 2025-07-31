import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify) => {
  const prisma = PrismaClient();
//  connect to database 
  await prisma.$connect();
  fastify.decorate("prisma", prisma);
// close connection
  fastify.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
  });
});
