import type { FastifyInstance } from "fastify";
import  supabase from "../plugins/supabase"; // your configured supabase client
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const authRoutes = async (fastify: FastifyInstance) => {
  // Signup
  fastify.post("/signup", async (request, reply) => {
    const { email, password,timezone } = request.body as {
      email: string;
      password: string;
      timezone:string;
    };

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return reply.code(400).send({ error: error.message });
    }

    // Create user in your DB (optional)
    await fastify.prisma.user.create({
      data: {
        email,
        supabaseId: data.user?.id || "",
        timezone:timezone
      },
    });

    const token = jwt.sign({ userId: data.user?.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return reply.send({ token });
  });

  // Login
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.session?.user.id) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: data.session.user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return reply.send({ token });
  });
};

export default authRoutes