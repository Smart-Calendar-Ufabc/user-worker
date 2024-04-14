import { beforeEach, describe, expect, it } from '@jest/globals'
import { compare, hash } from 'bcryptjs'

import { UsersRepository } from '../repositories/users-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'
import { InMemoryUsersTempRepository } from '../repositories/in-memory/in-memory-users-temp-repository'
import { CreateUserTempUseCase } from './create-user-temp'

let usersTempRepository: InMemoryUsersTempRepository
let usersRepository: UsersRepository
let sut: CreateUserTempUseCase

describe('Create User Temp Use Case', () => {
	beforeEach(() => {
		usersTempRepository = new InMemoryUsersTempRepository()
		usersRepository = new InMemoryUsersRepository()
		sut = new CreateUserTempUseCase(usersTempRepository, usersRepository)
	})

	it('should be able to register a new user temp', async () => {
		const { userTemp } = await sut.execute({
			email: 'janedoe@email.com',
			password: 'Password123@',
		})

		expect(userTemp.id).toBeDefined()
		expect(userTemp.code).toBeDefined()
	})

	it('should hash user password upon create user temp', async () => {
		const { userTemp } = await sut.execute({
			email: 'janedoe@email.com',
			password: 'Password123@',
		})

		const isPasswordCorrectlyHashed = await compare(
			'Password123@',
			userTemp.password_hash,
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register a new user with same email twice', async () => {
		await usersRepository.create({
			email: 'janedoe@email.com',
			password_hash: await hash('Password123@', 10),
		})

		await expect(
			sut.execute({
				email: 'janedoe@email.com',
				password: 'Password123@',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
