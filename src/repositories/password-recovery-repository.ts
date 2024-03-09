import { Prisma, PasswordRecovery } from "@prisma/client/edge";

export interface PasswordRecoveryRepository {
  findByUserId(userId: number): Promise<PasswordRecovery | null>;
  findByToken(token: string): Promise<PasswordRecovery | null>;
  create(user: Prisma.PasswordRecoveryUncheckedCreateInput): Promise<PasswordRecovery>;
  update(id: number, data: Prisma.PasswordRecoveryUpdateInput): Promise<PasswordRecovery>;
  delete(id: number): Promise<void>;
}