import { Prisma, UserTemp } from "@prisma/client/edge";
import { UsersTempRepository } from "../users-temp-repository";

export class InMemoryUsersTempRepository implements UsersTempRepository {
  public items: UserTemp[] = []

  async findUniqueByEmail(email: string) {
    const userTemp = this.items.find(userTemp => userTemp.email === email)

    if (!userTemp) {
      return null
    }

    return userTemp
  }

  async create({email,password_hash, code}: Prisma.UserTempCreateInput): Promise<UserTemp> {
    const userTemp: UserTemp = {
      id: crypto.randomUUID(),
      email,
      password_hash,
      code
    }

    this.items.push(userTemp)

    return userTemp
  }
    
}