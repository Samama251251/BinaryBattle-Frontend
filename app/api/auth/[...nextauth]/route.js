import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma =new PrismaClient();


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) {
        console.error("User email is not available");
        return false;
      }

      try {
        const existingUser = await prisma.api_user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (!existingUser) {
          const username = user.email.split("@")[0];
          await prisma.api_user.create({
            data: {
              username: username, // This is the @id field
              email: user.email,
              name: user.name || username,
              rank: "Newbie",
              score: 0,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking or creating user:", error);
        return false;
      }
    },

    async session({ session, token, user }) {
      if (session?.user?.email) {
        try {
          const existingUser = await prisma.api_user.findUnique({
            where: {
              email: session.user.email,
            },
          });

          if (existingUser) {
            session.user.username = existingUser.username;
            session.user.name = existingUser.name;
            // Add additional fields you want to include in the session
            session.user.rank = existingUser.rank;
            session.user.score = existingUser.score;
          }
        } catch (error) {
          console.error("Error fetching user in session callback:", error);
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/practice`;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };