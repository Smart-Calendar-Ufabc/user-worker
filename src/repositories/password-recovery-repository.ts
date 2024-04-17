import { Prisma, PasswordRecovery } from '@prisma/client/edge'

export interface PasswordRecoveryRepository {
	findUniqueByUserId(user_id: string): Promise<PasswordRecovery | null>
	findUniqueByToken(token: string): Promise<PasswordRecovery | null>
	create(
		user: Prisma.PasswordRecoveryUncheckedCreateInput,
	): Promise<PasswordRecovery>
	update(
		id: string,
		data: Prisma.PasswordRecoveryUpdateInput,
	): Promise<PasswordRecovery>
	delete(id: string): Promise<void>
}
