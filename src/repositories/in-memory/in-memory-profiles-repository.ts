import { Prisma, Profile } from '@prisma/client/edge'
import { ProfilesRepository } from '../profiles-repository'

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
		avatar_image_url,
		name,
		user_id,
	}: Prisma.ProfileUncheckedCreateInput) {
		const profile: Profile = {
			id: crypto.randomUUID(),
			avatar_image_url,
			name,
			user_id,
			created_at: new Date(),
			updated_at: new Date(),
		}

		this.items.push(profile)

		return profile
	}

	async save(profile: Profile) {
		const profileIndex = this.items.findIndex((item) => item.id === profile.id)

		if (profileIndex >= 0) {
			this.items[profileIndex] = profile
		}

		return profile
	}
}
