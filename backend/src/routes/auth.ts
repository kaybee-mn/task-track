import type { FastifyInstance } from "fastify";
import supabase from "../plugins/supabase"; // your configured supabase client
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/confirmation", async (request, response) => {
    const { email } = request.body as {
      email: string;
    };
    await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `exp://${process.env.LOCAL_IP}:8081/--/confirm`, // or whatever your deep link is
      },
    });
  });
  // Signup
  fastify.post("/signup", async (request, reply) => {
    const isDev = process.env.NODE_ENV !== "production";
    const redirectUrl = isDev
      ? `exp://${process.env.LOCAL_IP}:8081/--/confirm`
      : "myapp://confirm";
    const { email, password, timezone } = request.body as {
      email: string;
      password: string;
      timezone: string;
    };

    if (!email || !password) {
      return reply.status(400).send({ error: "Email and password required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    if (error) {
      return reply
        .code(400)
        .send({ error: "Supabase signup error: " + error.message });
    }
    // Create user in your DB (optional)
    await fastify.prisma.user
      .create({
        data: {
          email,
          supabaseId: data.user?.id || "",
          timezone: timezone,
        },
      })
      .then((err) => reply.code(400).send({ error: "error", err }));

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
      return reply.code(401).send({ error });
    }

    const token = jwt.sign({ userId: data.session.user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return reply.send({ token });
  });
};

export default authRoutes;
