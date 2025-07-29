import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

// declare
fastify.get("/", async (req, rep) => {
  return ({ message: "hello world" });
});

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