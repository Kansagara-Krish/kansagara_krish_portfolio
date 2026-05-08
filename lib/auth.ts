import bcrypt from "bcryptjs";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        
        const user = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email.toLowerCase() }
        });
        
        if (!user) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;
        
        return { id: user.id, email: user.email, name: user.email.split("@")[0] };
      }
    })
  ]
});
