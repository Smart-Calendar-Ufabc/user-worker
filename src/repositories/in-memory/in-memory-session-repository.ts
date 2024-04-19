import { Prisma, Session } from '@prisma/client'
import { SessionsRepository } from '../sessions-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export class InMemorySessionsRepository implements SessionsRepository {
	public items: Session[] = []

	async findUniqueByToken(token: string) {
		const session = this.items.find((item) => item.token === token)

		if (!session) {
			return null
		}

		return session
	}

	async findManyByUserId(userId: string) {
		return this.items.filter((item) => item.user_id === userId)
	}

	async create(data: Prisma.SessionUncheckedCreateInput) {
		const session: Session = {
			id: crypto.randomUUID(),
			token: data.token,
			created_at: new Date(),
			updated_at: new Date(),
			user_id: data.user_id,
		}

		this.items.push(session)

		return session
	}

	async update(id: string, data: Prisma.SessionUpdateInput) {
		const session = this.items.find((item) => item.id === id)

		if (!session) {
			throw new ResourceNotFoundError()
		}

		Object.assign(session, data)

		return session
	}

	async delete(id: string) {
		const sessionIndex = this.items.findIndex((item) => item.id === id)

		if (sessionIndex === -1) {
			throw new ResourceNotFoundError()
		}

		this.items.splice(sessionIndex, 1)
	}

	async deleteByUserIdAndToken(userId: string, token: string) {
		this.items = this.items.filter(
			(item) => item.user_id !== userId && item.token !== token,
		)
	}
}
