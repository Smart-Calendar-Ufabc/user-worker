import { Prisma, PrismaClient } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

export class PrismaUsersRepository implements UsersRepository {
	private prisma: PrismaClient

	constructor(config: PoolConfig) {
		const pool = new Pool(config)
		const adapter = new PrismaPg(pool)
		const prisma = new PrismaClient({ adapter })

		this.prisma = prisma
	}

	async findUniqueById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				profile: true,
			},
		})

		return user
	}

	async findUniqueByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
			include: {
				profile: true,
			},
		})

		return user
	}

	async create(user: Prisma.UserCreateInput) {
		const newUser = await this.prisma.user.create({
			data: user,
		})

		return newUser
	}

	async update(id: string, data: Prisma.UserUpdateInput) {
		const updatedUser = await this.prisma.user.update({
			where: {
				id,
			},
			data,
		})

		return updatedUser
	}
}
