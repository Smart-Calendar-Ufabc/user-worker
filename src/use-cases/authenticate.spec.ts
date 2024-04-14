import {
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	jest,
} from '@jest/globals'
import { UsersRepository } from '../repositories/users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'
import { SessionsRepository } from '../repositories/sessions-repository'
import { InMemorySessionsRepository } from '../repositories/in-memory/in-memory-session-repository'

let usersRepository: UsersRepository
let sessionsRepository: SessionsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
	beforeAll(() => {
		jest
			.spyOn(crypto, 'randomUUID')
			.mockImplementation(() => Math.random().toString())
	})

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sessionsRepository = new InMemorySessionsRepository()
		sut = new AuthenticateUseCase(usersRepository, sessionsRepository)
	})

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			email: 'janedoe@email.com',
			password_hash: await hash('N@ruto123', 8),
		})

		const { user } = await sut.execute({
			email: 'janedoe@email.com',
			password: 'N@ruto123',
		})

		expect(user.id).toBeDefined()
	})

	it('should not be able to authenticate with wrong email', async () => {
		await usersRepository.create({
			email: 'janedoe@email.com',
			password_hash: await hash('N@ruto123', 8),
		})

		await expect(
			sut.execute({
				email: 'ThisIsWrongEmail',
				password: 'N@ruto123',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			email: 'janedoe@email.com',
			password_hash: await hash('N@ruto123', 8),
		})

		await expect(
			sut.execute({
				email: 'janedoe@email.com',
				password: 'ThisIsTheWrongPassword',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
