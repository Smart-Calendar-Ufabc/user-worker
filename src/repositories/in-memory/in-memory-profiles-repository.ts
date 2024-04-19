import { Prisma, Profile } from '@prisma/client'
import { ProfilesRepository } from '../profiles-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export class InMemoryProfilesRepository implements ProfilesRepository {
	public items: Profile[] = []

	async findUniqueById(id: string) {
		const profile = this.items.find((item) => item.id === id)

		if (!profile) {
			return null
		}

		return profile
	}

	async findUniqueByUserId(user_id: string) {
		const profile = this.items.find((item) => item.user_id === user_id)

		if (!profile) {
			return null
		}

		return profile
	}

	async create({
		name,
		user_id,
		avatar_image_url,
	}: Prisma.ProfileUncheckedCreateInput) {
		const profile: Profile = {
			id: crypto.randomUUID(),
			publicId: crypto.randomUUID(),
			created_at: new Date(),
			updated_at: new Date(),
			name: name || null,
			user_id,
			avatar_image_url: avatar_image_url || null,
			sleepHours: {
				start: {
					hour: 22,
					minutes: 0,
				},
				end: {
					hour: 8,
					minutes: 0,
				},
			},
		}

		this.items.push(profile)

		return profile
	}

	async save(id: string, data: Prisma.ProfileUncheckedUpdateInput) {
		const profile = this.items.find((item) => item.id === id)

		if (!profile) {
			throw new ResourceNotFoundError()
		}

		Object.assign(profile, data)

		return profile
	}
}
