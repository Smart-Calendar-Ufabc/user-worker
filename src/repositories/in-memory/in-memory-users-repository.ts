import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { ResourceNotFoundError } from "../../use-cases/errors/ResourceNotFoundError";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  
  async create({email, password_hash}: Prisma.UserCreateInput) {
    const user: User = {
      id: this.items.length + 1,
      email,
      password_hash,
      password_salt: null,
      created_at: new Date(),
    }

    this.items.push(user);

    return user;
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = this.items.find((user) => user.id === id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    Object.assign(user, data);

    return user;
  }
}