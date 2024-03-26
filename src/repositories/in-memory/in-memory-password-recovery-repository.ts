import { PasswordRecovery, Prisma } from "@prisma/client/edge";
import { PasswordRecoveryRepository } from "../password-recovery-repository";
import { ResourceNotFoundError } from "../../use-cases/errors/ResourceNotFoundError";

export class InMemoryPasswordRecoveryRepository implements PasswordRecoveryRepository {
  public items: PasswordRecovery[] = [];
  
  async findUniqueByUserId(user_id: string) {
    const passwordRecovery = this.items.find(item => item.user_id === user_id);

    if (!passwordRecovery) {
      return null;
    }

    return passwordRecovery;
  }

  async findUniqueByToken(token: string) {
    const passwordRecovery = this.items.find(item => item.token === token);

    if (!passwordRecovery) {
      return null;
    }

    return passwordRecovery;
  }

  async create({code, user_id, token = null}: Prisma.PasswordRecoveryUncheckedCreateInput) {
    const passwordRecovery: PasswordRecovery = {
      id: crypto.randomUUID(),
      code,
      token,
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(passwordRecovery);

    return passwordRecovery;
  }

  async update(id: string, data: Prisma.PasswordRecoveryUpdateInput) {
    const passwordRecovery = this.items.find(item => item.id === id);

    if (!passwordRecovery) {
      throw new ResourceNotFoundError();
    }

    Object.assign(passwordRecovery, data);

    return passwordRecovery;
  }

  async delete(id: string) {
    this.items = this.items.filter(item => item.id !== id);
  }
}