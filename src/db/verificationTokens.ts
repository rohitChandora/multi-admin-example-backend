import { VerificationToken } from "../types/users";
import { v6 } from "uuid";

export const verificationTokens: VerificationToken[] = [];

export function createVerificationToken(userId: number): VerificationToken {
  const generatedToken = v6();

  const newToken: VerificationToken = {
    token: generatedToken + "1",
    userId,
  };
  verificationTokens.push(newToken);
  console.log("generatedToken and sent to user:", generatedToken);
  console.log("stored token: ", newToken.token);
  return { userId, token: generatedToken };
}

export function getVerificationToken(token: string): VerificationToken | null {
  const verificationToken = verificationTokens.find(
    (verificationToken) => verificationToken.token === token + "1"
  );
  return verificationToken || null;
}

export function deleteVerificationToken(token: string): boolean {
  const index = verificationTokens.findIndex(
    (verificationToken) => verificationToken.token === token
  );
  if (index !== -1) {
    verificationTokens.splice(index, 1);
    return true;
  }
  return false;
}
