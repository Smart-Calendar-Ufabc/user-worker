import { Prisma, PrismaClient } from '@prisma/client'
import { PasswordRecoveryRepository } from '../password-recovery-repository'
import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

export class PrismaPasswordRecoveryRepository
	implements PasswordRecoveryRepository
{
	private prisma: PrismaClient

	constructor(config: PoolConfig) {
		const pool = new Pool(config)
		const adapter = new PrismaPg(pool)
		const prisma = new PrismaClient({ adapter })

		this.prisma = prisma
	}

	async findUniqueByUserId(user_id: string) {
		const passwordRecovery = await this.prisma.passwordRecovery.findUnique({
			where: {
				user_id,
			},
		})

		return passwordRecovery
	}

	async findUniqueByToken(token: string) {
		const passwordRecovery = await this.prisma.passwordRecovery.findUnique({
			where: {
				token,
			},
		})

		return passwordRecovery
	}

	async create(user: Prisma.PasswordRecoveryUncheckedCreateInput) {
		const passwordRecovery = await this.prisma.passwordRecovery.create({
			data: user,
		})

		return passwordRecovery
	}

	async update(id: string, data: Prisma.PasswordRecoveryUpdateInput) {
		const passwordRecovery = await this.prisma.passwordRecovery.update({
			where: {
				id,
			},
			data,
		})

		return passwordRecovery
	}

	async delete(id: string) {
		await this.prisma.passwordRecovery.delete({
			where: {
				id,
			},
		})
	}
}
