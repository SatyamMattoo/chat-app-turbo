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
        const { identifier, password } = credentials || {};

        if (!identifier || !password) {
          throw new Error("Invalid credentials!");
        }

        const user = await client.user.findFirst({
          where: {
            OR: [{ email: identifier }, { username: identifier }],
          },
        });

        if (!user || !user.password) {
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
      if (account?.provider !== "credentials") {
        const username = user.email?.split("@")[0];

        if (!user.email || !username) {
          console.error("Invalid email or username during sign-in.");
          return false;
        }

        const existingUser = await client.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newUser = await client.user.create({
            data: {
              name: user.name || username,
              email: user.email,
              image: user.image || null,
              username,
            },
          });
          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
        }
      }

      return true;
    },
  },
  cookies: {
    sessionToken: {
      name: "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
        secure: process.env.ENVIRONMENT === "production",
        path: "/",
      },
    },
    callbackUrl: {
      name: "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
        secure: process.env.ENVIRONMENT === "production",
        path: "/",
      },
    },
    csrfToken: {
      name: "authjs.csrf-token",
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
