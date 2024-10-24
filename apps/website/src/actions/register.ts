"use server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { client } from "../utils/prisma";

// Define Zod schema for form validation
const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

// Define a server action for registering the user
export const register = async (formData: FormData) => {
  // Parse and validate form data using Zod
  const parsedData = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If validation fails, throw a detailed error
  if (!parsedData.success) {
    const { errors } = parsedData.error;
    const errorMessage = errors.map((err) => err.message).join(", ");
    throw new Error(errorMessage);
  }

  const { email, password, name } = parsedData.data;

  // Derive username from email (before '@' symbol)
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
