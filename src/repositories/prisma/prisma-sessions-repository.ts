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
		return await this.prisma.session.findUnique({
			where: {
				token,
			},
		})
	}

	async findManyByUserId(userId: string) {
		return await this.prisma.session.findMany({
			where: {
				user_id: userId,
			},
		})
	}

	async create(data: Prisma.SessionUncheckedCreateInput) {
		return await this.prisma.session.create({
			data,
		})
	}

	async update(id: string, data: Prisma.SessionUpdateInput) {
		return await this.prisma.session.update({
			where: {
				id,
			},
			data,
		})
	}

	async delete(id: string) {
		await this.prisma.session.delete({
			where: {
				id,
			},
		})
	}

	async deleteByUserId(userId: string) {
		await this.prisma.session.deleteMany({
			where: {
				user_id: userId,
			},
		})
	}
}
