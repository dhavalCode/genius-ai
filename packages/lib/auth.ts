import type { NextApiRequest } from "next";
import { HttpError } from "@genius-ai/lib/server";
import { compare, hash } from "bcryptjs";
import type { Session } from "next-auth";
import { GetSessionParams, getSession as getSessionInner } from "next-auth/react";

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export function validPassword(password: string) {
  if (password.length < 7) return false;

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) return false;

  if (!/\d+/.test(password)) return false;

  return true;
}

export async function getSession(options: GetSessionParams): Promise<Session | null> {
  const session = await getSessionInner(options);

  // that these are equal are ensured in `[...nextauth]`'s callback
  return session as Session | null;
}

type CtxOrReq =
  | { req: NextApiRequest; ctx?: never }
  | { ctx: { req: NextApiRequest }; req?: never };

export const ensureSession = async (ctxOrReq: CtxOrReq) => {
  const session = await getSession(ctxOrReq);
  if (!session?.user) throw new HttpError({ statusCode: 401, message: "Unauthorized" });
  return session;
};

export enum ErrorCode {
  UserNotFound = "user-not-found",
  IncorrectPassword = "incorrect-password",
  UserMissingPassword = "missing-password",
  TwoFactorDisabled = "two-factor-disabled",
  TwoFactorAlreadyEnabled = "two-factor-already-enabled",
  TwoFactorSetupRequired = "two-factor-setup-required",
  SecondFactorRequired = "second-factor-required",
  IncorrectTwoFactorCode = "incorrect-two-factor-code",
  InternalServerError = "internal-server-error",
  NewPasswordMatchesOld = "new-password-matches-old",
  ThirdPartyIdentityProviderEnabled = "third-party-identity-provider-enabled",
  SocialIdentityProviderRequired = "social-identity-provider-required",
}
