"use server";
import { hash } from "bcryptjs";
import { client } from "../utils/prisma";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

// Define a server action for registering the user
export const register = async ({
  email,
  password,
  name,
}: {
  email: string;
  name: string;
  password: string;
}) => {
  const username = email.split("@")[0];
  if (!username) {
    throw new Error("Username could not be created from email.");
  }

  // Check if the username or email already exists
  const existingUser = await client.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    throw new Error("User with this email or username already exists.");
  }

  // Hash the password
  const hashedPassword = await hash(password, 10);

  // Create the user in the database
  try {
    await client.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
      },
    });
  } catch (error: any) {
    throw new Error("An error occurred while creating the user.");
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await signIn("credentials", {
      identifier: email,
      password,
      redirect: false,
    });

    return response;
  } catch (error: any) {
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return {
          message: error.cause.err.message,
          success: false,
        };
      }
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
            success: false,
          };
        default:
          return {
            message: "Something went wrong",
            success: false,
          };
      }
    }
    throw error;
  }
};
