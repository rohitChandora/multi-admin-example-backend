declare namespace Express {
  export interface Request {
    currentUser?: typeof User;
  }
}
