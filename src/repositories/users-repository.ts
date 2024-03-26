import { Prisma, User } from "@prisma/client/edge";

export interface UsersRepository {
  findUniqueById(id: string): Promise<User | null>;
  findUniqueByEmail(email: string): Promise<User | null>;
  create(user: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}