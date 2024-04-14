import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, PoolConfig } from 'pg'
import { UsersTempRepository } from '../users-temp-repository'

export class PrismaUsersTempRepository implements UsersTempRepository {
	private prisma: PrismaClient

	constructor(config: PoolConfig) {
		const pool = new Pool(config)
		const adapter = new PrismaPg(pool)
		const prisma = new PrismaClient({ adapter })

		this.prisma = prisma
	}

	async findUniqueByEmail(email: string) {
		const userTemp = await this.prisma.userTemp.findUnique({
			where: {
				email,
			},
		})

		return userTemp
	}

	async create(data: Prisma.UserTempCreateInput) {
		const userTemp = await this.prisma.userTemp.create({
			data,
		})

		return userTemp
	}

	async delete(id: string) {
		await this.prisma.userTemp.delete({
			where: {
				id,
			},
		})
	}
}
