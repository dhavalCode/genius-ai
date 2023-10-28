import { ErrorCode } from "@genius-ai/lib/auth";
import { verifyPassword } from "@genius-ai/lib/auth";
import prisma from "@genius-ai/prisma";
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Genius ai Login",
      type: "credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Select a password.",
        },
      },
      async authorize(credentials: any) {
        if (!credentials) {
          console.error("Credential missing in authorize()");
          throw new Error(ErrorCode.InternalServerError);
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
          },
        });

        if (!user) {
          throw new Error(ErrorCode.UserNotFound);
        }

        if (!user.password) {
          throw new Error(ErrorCode.UserMissingPassword);
        }

        const isCorrectPassword = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error(ErrorCode.IncorrectPassword);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      return {
        ...token,
      };
    },
    async session({ session, token }) {
      const authSession: Session = {
        ...session,
        user: {
          ...session.user,
        },
      };

      authSession.expires;
      return authSession;
    },
    async signIn({ profile }) {
      if (profile?.email) {
        const userExist = await prisma.user.findFirst({
          where: {
            email: profile.email,
          },
        });
        if (!userExist) {
          try {
            await prisma.user.upsert({
              where: {
                email: profile.email,
              },
              create: {
                email: profile.email,
                name: profile.name,
                identityProvider: "GOOGLE",
                emailVerified: new Date(Date.now())
              },
              update: {
                email: profile.email,
                name: profile.name,
                identityProvider: "GOOGLE",
                emailVerified: new Date(Date.now())
              },
            });
          } catch (error) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
  },
});
