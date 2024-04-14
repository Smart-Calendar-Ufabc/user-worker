import { Prisma, PrismaClient } from '@prisma/client'
import { SessionsRepository } from '../sessions-repository'
import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

export class PrismaSessionsRepository implements SessionsRepository {
	private prisma: PrismaClient

	constructor(config: PoolConfig) {
		const pool = new Pool(config)
		const adapter = new PrismaPg(pool)
		const prisma = new PrismaClient({ adapter })

		this.prisma = prisma
	}

	async findUniqueByToken(token: string) {
		return this.prisma.session.findUnique({
			where: {
				token,
			},
		})
	}

	async create(data: Prisma.SessionUncheckedCreateInput) {
		return this.prisma.session.create({
			data,
		})
	}

	async update(id: string, data: Prisma.SessionUpdateInput) {
		return this.prisma.session.update({
			where: {
				id,
			},
			data,
		})
	}

	async delete(id: string) {
		this.prisma.session.delete({
			where: {
				id,
			},
		})
	}
}
