import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Magic link via Resend
    // Requires AUTH_RESEND_KEY env var (Auth.js v5 naming)
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    }),
    // GitHub OAuth (optional — set GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET)
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

        // Auto-grant owner to the designated owner email
        const OWNER_EMAIL = "araroosevelt133@gmail.com";
        let isOwner = false;

        if (user.email === OWNER_EMAIL) {
          // Ensure isOwner is set in DB (idempotent)
          await prisma.user.update({
            where: { id: user.id },
            data: { isOwner: true },
          });
          isOwner = true;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isOwner: true },
          });
          isOwner = dbUser?.isOwner ?? false;
        }

        (session.user as typeof session.user & { isOwner: boolean }).isOwner = isOwner;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
});
