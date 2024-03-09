import { PasswordRecovery, Prisma } from "@prisma/client";
import { PasswordRecoveryRepository } from "../password-recovery-repository";
import { ResourceNotFoundError } from "../../use-cases/errors/ResourceNotFoundError";

export class InMemoryPasswordRecoveryRepository implements PasswordRecoveryRepository {
  public items: PasswordRecovery[] = [];
  
  async findByUserId(userId: number) {
    const passwordRecovery = this.items.find(item => item.user_id === userId);

    if (!passwordRecovery) {
      return null;
    }

    return passwordRecovery;
  }

  async findByToken(token: string) {
    const passwordRecovery = this.items.find(item => item.token === token);

    if (!passwordRecovery) {
      return null;
    }

    return passwordRecovery;
  }

  async create({code, user_id, token = null}: Prisma.PasswordRecoveryUncheckedCreateInput) {
    const passwordRecovery: PasswordRecovery = {
      id: this.items.length + 1,
      code,
      token,
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(passwordRecovery);

    return passwordRecovery;
  }

  async update(id: number, data: Prisma.PasswordRecoveryUpdateInput) {
    const passwordRecovery = this.items.find(item => item.id === id);

    if (!passwordRecovery) {
      throw new ResourceNotFoundError();
    }

    Object.assign(passwordRecovery, data);

    return passwordRecovery;
  }

  async delete(id: number) {
    this.items = this.items.filter(item => item.id !== id);
  }
}