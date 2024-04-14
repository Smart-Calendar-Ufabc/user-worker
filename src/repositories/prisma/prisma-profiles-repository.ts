import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, PoolConfig } from 'pg'
import { ProfilesRepository } from '../profiles-repository'

export class PrismaProfilesRepository implements ProfilesRepository {
	private prisma: PrismaClient

	constructor(config: PoolConfig) {
		const pool = new Pool(config)
		const adapter = new PrismaPg(pool)
		const prisma = new PrismaClient({ adapter })

		this.prisma = prisma
	}

	async findUniqueById(id: string) {
		const profile = await this.prisma.profile.findUnique({
			where: {
				id,
			},
		})

		return profile
	}

	async findUniqueByUserId(user_id: string) {
		const profile = await this.prisma.profile.findUnique({
			where: {
				user_id,
			},
		})

		return profile
	}

	async create(data: Prisma.ProfileUncheckedCreateInput) {
		const profile = await this.prisma.profile.create({
			data,
		})

		return profile
	}

	async save(id: string, data: Prisma.ProfileUpdateInput) {
		const profile = await this.prisma.profile.update({
			where: {
				id,
			},
			data,
		})

		return profile
	}
}
