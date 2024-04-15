import { Profile } from '@prisma/client/edge'
import { ProfilesRepository } from '../repositories/profiles-repository'

interface GetProfileRequest {
	userId: string
}

interface GetProfileResponse {
	profile: Profile | null
}

export class GetProfileUseCase {
	constructor(private profilesRepository: ProfilesRepository) {
		this.profilesRepository = profilesRepository
	}

	async execute({ userId }: GetProfileRequest): Promise<GetProfileResponse> {
		const profile = await this.profilesRepository.findUniqueByUserId(userId)

		return {
			profile,
		}
	}
}
