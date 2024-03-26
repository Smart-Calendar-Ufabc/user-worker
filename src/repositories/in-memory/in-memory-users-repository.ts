import { Prisma, User } from "@prisma/client/edge";
import { UsersRepository } from "../users-repository";
import { ResourceNotFoundError } from "../../use-cases/errors/ResourceNotFoundError";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findUniqueById(id: string) {
    const user = this.items.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findUniqueByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  
  async create({email, password_hash}: Prisma.UserCreateInput) {
    const user: User = {
      id: crypto.randomUUID(),
      email,
      password_hash,
      password_salt: null,
      created_at: new Date(),
    }

    this.items.push(user);

    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const user = this.items.find((user) => user.id === id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    Object.assign(user, data);

    return user;
  }
}