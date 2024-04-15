import { beforeEach, describe, expect, it } from '@jest/globals'

import { hash } from 'bcryptjs'
import { ProfilesRepository } from '../repositories/profiles-repository'
import { CreateProfileUseCase } from './create-profile'
import { InMemoryProfilesRepository } from '../repositories/in-memory/in-memory-profiles-repository'
import { UsersRepository } from '../repositories/users-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { InMemoryFileStorage } from '../services/file-storage/in-memory/in-memory-file-storage'
import { FileStorage } from '../services/file-storage/file-storage'

let profilesRepository: ProfilesRepository
let usersRepository: UsersRepository
let fileStorage: FileStorage
let sut: CreateProfileUseCase

describe('Create Profile Use Case', () => {
	beforeEach(() => {
		profilesRepository = new InMemoryProfilesRepository()
		usersRepository = new InMemoryUsersRepository()
		fileStorage = new InMemoryFileStorage()
		sut = new CreateProfileUseCase(
			profilesRepository,
			usersRepository,
			fileStorage,
		)
	})

	it('should be able to create a new profile', async () => {
		const user = await usersRepository.create({
			email: 'janedoe@email.com',
			password_hash: await hash('N@ruto123', 8),
		})

		const { profile } = await sut.execute({
			name: 'Jane Doe',
			avatar: 'http://avatar.com/avatar.jpg',
			user_id: user.id,
		})

		expect(profile.id).toBeDefined()
	})

	it('should not be able to create a new profile with inexistent user', async () => {
		await expect(
			sut.execute({
				name: 'Jane Doe',
				avatar: 'http://avatar.com/avatar.jpg',
				user_id: 'inexistent-profile',
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
