import { Prisma, Session } from '@prisma/client'

export interface SessionsRepository {
	findUniqueByToken(token: string): Promise<Session | null>
	findManyByUserId(userId: string): Promise<Session[]>
	create(data: Prisma.SessionUncheckedCreateInput): Promise<Session>
	update(id: string, data: Prisma.SessionUpdateInput): Promise<Session>
	delete(id: string): Promise<void>
	deleteByUserIdAndToken(userId: string, token: string): Promise<void>
}
