import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Magic link via email (requires Resend API key)
    Resend({
      from: process.env.EMAIL_FROM ?? "noreply@kirodaily.com",
    }),
    // GitHub OAuth (optional)
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verify=1",
    error: "/login?error=1",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch isOwner from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isOwner: true },
        });
        (session.user as typeof session.user & { isOwner: boolean }).isOwner =
          dbUser?.isOwner ?? false;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
});
