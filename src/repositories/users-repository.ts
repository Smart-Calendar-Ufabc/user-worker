import { Prisma, User } from "@prisma/client/edge";

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Prisma.UserCreateInput): Promise<User>;
  update(id: number, data: Prisma.UserUpdateInput): Promise<User>;
}