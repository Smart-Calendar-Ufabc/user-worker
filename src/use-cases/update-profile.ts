import { Profile } from '@prisma/client/edge'
import { ProfilesRepository } from '../repositories/profiles-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { FileStorage } from '../services/file-storage/file-storage'
import { FILE_STORAGE } from '../config'
import { UsersRepository } from '../repositories/users-repository'

interface UpdateProfileRequest {
	id: string
	name?: string
	avatar?: string
	sleepHours?: {
		start: {
			hour: number
			minutes: number
		}
		end: {
			hour: number
			minutes: number
		}
	}
}

interface UpdateProfileResponse {
	profile: Profile
}

export class UpdateProfileUseCase {
	constructor(
		private profilesRepository: ProfilesRepository,
		private usersRepository: UsersRepository,
		private fileStorageService: FileStorage,
	) {
		this.profilesRepository = profilesRepository
	}

	async execute({
		id,
		name,
		avatar,
		sleepHours,
	}: UpdateProfileRequest): Promise<UpdateProfileResponse> {
		const profile = await this.profilesRepository.findUniqueById(id)

		if (!profile) {
			throw new ResourceNotFoundError()
		}

		if (avatar) {
			// TODO: delete old image from cloudinary
			const image = await this.fileStorageService.upload({
				image: avatar,
				optionalParams: [
					{ name: 'filename_override', value: 'avatar' },
					{
						name: 'folder',
						value: FILE_STORAGE.USER_FOLDER(profile?.publicId || ''),
					},
					{ name: 'format', value: 'jpg' },
				],
			})

			const newProfile = await this.profilesRepository.save(profile.id, {
				name,
				avatar_image_url: image.url,
				sleepHours,
			})

			await this.usersRepository.update(profile.user_id, {
				onboarding_completed: true,
			})

			return {
				profile: newProfile,
			}
		}

		const newProfile = await this.profilesRepository.save(profile.id, {
			name,
			sleepHours,
		})

		await this.usersRepository.update(profile.user_id, {
			onboarding_completed: true,
		})

		return {
			profile: newProfile,
		}
	}
}
