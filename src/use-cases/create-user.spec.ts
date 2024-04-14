import { beforeEach, describe, expect, it } from '@jest/globals'

import { UsersRepository } from '../repositories/users-repository'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InMemoryUsersTempRepository } from '../repositories/in-memory/in-memory-users-temp-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { InvalidCodeError } from './errors/InvalidCodeError'

let usersRepository: UsersRepository
let usersTempRepository: InMemoryUsersTempRepository
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		usersTempRepository = new InMemoryUsersTempRepository()
		sut = new CreateUserUseCase(usersRepository, usersTempRepository)
	})

	it('should be able to register a new user', async () => {
		await usersTempRepository.create({
			email: 'janedoe@email.com',
			password_hash: await hash('hashed_password', 10),
			code: '123456',
		})

		const { user } = await sut.execute({
			email: 'janedoe@email.com',
			code: '123456',
		})

		expect(user.id).toBeDefined()
	})

	it('should not be able to register a new user with inexistent user temp', async () => {
		await expect(
			sut.execute({
				email: 'janedoe@email.com',
				code: '123456',
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to register a new user with invalid code', async () => {
		await usersTempRepository.create({
			email: 'janedoe@email.com',
			password_hash: await hash('hashed_password', 10),
			code: '123456',
		})

		await expect(
			sut.execute({
				email: 'janedoe@email.com',
				code: 'invalid_code',
			}),
		).rejects.toBeInstanceOf(InvalidCodeError)
	})
})
