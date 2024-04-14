import { Prisma, Session } from '@prisma/client'

export interface SessionsRepository {
	findUniqueByToken(token: string): Promise<Session | null>
	create(data: Prisma.SessionUncheckedCreateInput): Promise<Session>
	update(id: string, data: Prisma.SessionUpdateInput): Promise<Session>
	delete(id: string): Promise<void>
}
