import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { client } from "./utils/prisma";
import { compare } from "bcryptjs";

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
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      let username;
  
      if (account?.provider === "google") {
        if (user.email) {
          username = user.email.split("@")[0];
        }
      } else if (account?.provider === "github") {
        if (user.name) {
          username = user.name;
        }
      }
  
      if(!user.email) {
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
        await client.user.create({
          data: {
            name: user.name || username,
            email: user.email,
            image: user.image || null,
            username: username
          },
        });
      }
      return true; // Return true to allow sign-in
    },
  },
});
