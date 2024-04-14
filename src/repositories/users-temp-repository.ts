import { Prisma, UserTemp } from '@prisma/client'

export interface UsersTempRepository {
	findUniqueByEmail(email: string): Promise<UserTemp | null>
	create(data: Prisma.UserTempCreateInput): Promise<UserTemp>
	delete(id: string): Promise<void>
}
