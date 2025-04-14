export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface VerificationToken {
  token: string;
  userId: number;
}
