import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Sign-in callback to handle user creation and database sync
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error("User email is not available");
        return false;
      }

      try {
        // Check if the user already exists in the PostgreSQL database
        let existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        // If the user doesn't exist, create a new user
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              username: user.email.split("@")[0], // Use the part before '@' as username
              rank: "Newbie", // Set default rank
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking or creating user:", error);
        return false;
      }
    },

    // Session callback to handle the user session
    async session({ session, token, user }) {
      if (session.user?.email) {
        // Get the user from the database
        const existingUser = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });

        // Attach user data to session
        if (existingUser) {
          session.user.id = existingUser.id.toString(); // Prisma returns id as Int, convert it to string
          session.user.name = existingUser.name;
        }
      }
      return session;
    },

    // Redirect callback to define where to redirect after login
    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirect to the homepage or dashboard
    },
  },
  pages: {
    signIn: '/login', // Define a custom login page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
