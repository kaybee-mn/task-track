import type { FastifyInstance } from "fastify";
import {} from '../services/tasks.ts'

export default async function taskRoutes(fastify:FastifyInstance){
    fastify.get('/tasks',getTasks);

}