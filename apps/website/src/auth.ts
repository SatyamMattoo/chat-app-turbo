import NextAuth from "next-auth";
import { compare } from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { client } from "./utils/prisma";

export const { handlers, signIn, signOut, auth }: any = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;

        if (!identifier || !password) {
          throw new Error("Invalid credentials!");
        }

        const user = await client.user.findFirst({
          where: {
            OR: [
              { email: identifier }, // Check by email
              { username: identifier }, // Check by username
            ],
          },
        });

        if (!user) {
          throw new Error("Please create an account first!");
        }

        if (!user.password) {
          throw new Error("Invalid credentials!");
        }
        const matchPassword = await compare(password.toString(), user.password);

        if (!matchPassword) {
          throw new Error("Invalid credentials!");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        //@ts-ignore
        session.user = token;
      }
      return session;
    },
    async signIn({ user, account }) {
      let username;

      if (account?.provider === "google") {
        if (user.email) {
          username = user.email.split("@")[0];
        }
      } else if (account?.provider === "github") {
        if (user.email) {
          username = user.email.split("@")[0];
        }
      }

      if (account?.provider !== "credentials") {
        if (!user.email) {
          console.error("Email not found in sign-in data.");
          return false;
        }
        // Check if username was successfully created
        if (!username) {
          console.error("Username could not be created from sign-in data.");
          return false;
        }

        // Check if the user already exists in the database
        const existingUser = await client.user.findUnique({
          where: {
            email: user.email,
          },
        });

        // If the user does not exist, create a new user
        if (!existingUser) {
          const newUser = await client.user.create({
            data: {
              name: user.name || username,
              email: user.email,
              image: user.image || null,
              username: username,
            },
          });
          user.id = newUser.id; // Add the `id` from the created user
        } else {
          user.id = existingUser.id; // Use the `id` from the existing user
        }
      }
      return true;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.ENVIRONMENT === "production" ? "__Secure-next-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
        secure: process.env.ENVIRONMENT === "production",
        path: "/",
        domain: process.env.ENVIRONMENT === "production" ? ".vercel.app" : undefined,
      },
    },
    callbackUrl: {
      name: process.env.ENVIRONMENT === "production" ? "__Secure-next-authjs.callback-url" : "authjs.callback-url",
      options: {
        secure: process.env.ENVIRONMENT === "production",
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
        path: "/",
        domain: process.env.ENVIRONMENT === "production" ? ".vercel.app" : undefined,
      },
    },
    csrfToken: {
      name: process.env.ENVIRONMENT === "production" ? "__Host-next-auth.csrf-token" : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
        secure: process.env.ENVIRONMENT === "production",
        path: "/",
      },
    },
  },
  pages: {
    error: "/error",
    signIn: "/auth/login",
  },
});
