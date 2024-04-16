import { Profile } from '@prisma/client/edge'
import { ProfilesRepository } from '../repositories/profiles-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'
import { FileStorage } from '../services/file-storage/file-storage'
import { FILE_STORAGE } from '../config'

interface CreateProfileRequest {
	user_id: string
	name: string
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

interface CreateProfileResponse {
	profile: Profile
}

export class CreateProfileUseCase {
	constructor(
		private profilesRepository: ProfilesRepository,
		private usersRepository: UsersRepository,
		private fileStorageService: FileStorage,
	) {
		this.profilesRepository = profilesRepository
	}

	async execute({
		user_id,
		name,
		avatar,
		sleepHours,
	}: CreateProfileRequest): Promise<CreateProfileResponse> {
		const user = await this.usersRepository.findUniqueById(user_id)

		if (!user) {
			throw new ResourceNotFoundError()
		}

		const profile = await this.profilesRepository.findUniqueByUserId(user_id)

		if (profile) {
			throw new UserAlreadyExistsError()
		}

		let newProfile = await this.profilesRepository.create({
			publicId: crypto.randomUUID(),
			name,
			user_id,
			sleepHours,
		})

		// TODO: send image to cloudinary to get the image url
		if (avatar) {
			const image = await this.fileStorageService.upload({
				image: avatar,
				optionalParams: [
					{ name: 'filename_override', value: 'avatar' },
					{
						name: 'folder',
						value: FILE_STORAGE.USER_FOLDER(newProfile?.publicId || ''),
					},
					{ name: 'format', value: 'jpg' },
				],
			})

			newProfile = await this.profilesRepository.save(newProfile.id, {
				avatar_image_url: image.url,
			})
		}

		return {
			profile: newProfile,
		}
	}
}
