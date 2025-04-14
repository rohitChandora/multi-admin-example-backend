import { getID } from "../lib/helpers";

const users: User[] = [];

export class User {
  public id: number | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;
  public deletedAt: Date | null | undefined;
  public emailVerified: boolean | undefined;

  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  create() {
    this.id = getID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
    this.emailVerified = false;
    return this;
  }

  save() {
    users.push(this);
    return this;
  }

  static find() {
    return users;
  }

  static findById(id: number) {
    return users.find((user) => user.id === id);
  }
}
