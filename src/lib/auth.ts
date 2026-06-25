import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
  appName: "Women in Engineering Zimbabwe",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
    transaction: false,
  }),

  // Our schema's id columns are strict Postgres `uuid` with a
  // gen_random_uuid() default. Without this, Better Auth generates its own
  // non-UUID id strings, which Postgres then rejects on insert.
  advanced: {
    database: {
      generateId: false,
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your WiEZ password",
        html: `
          <p>Hi ${user.name},</p>
          <p>Click the link below to reset your Women in Engineering Zimbabwe account password. This link expires in 1 hour.</p>
          <p><a href="${url}">Reset your password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your WiEZ account",
        html: `
          <p>Hi ${user.name},</p>
          <p>Welcome to Women in Engineering Zimbabwe. Please verify your email address to activate your account.</p>
          <p><a href="${url}">Verify your email</a></p>
        `,
      });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      province: {
        type: "string",
        required: false,
      },
      engineeringDiscipline: {
        type: "string",
        required: false,
      },
    },
  },

  plugins: [nextCookies()],
});

export type Auth = typeof auth;
