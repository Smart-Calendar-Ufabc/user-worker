import { beforeEach, describe, expect, it } from '@jest/globals'
import { PasswordRecoveryRepository } from '../repositories/password-recovery-repository'
import { UsersRepository } from '../repositories/users-repository'
import { PasswordRecoveryConfirmCodeUseCase } from './password-recovery-confirm-code'
import { InMemoryPasswordRecoveryRepository } from '../repositories/in-memory/in-memory-password-recovery-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { InvalidCodeError } from './errors/InvalidCodeError'

let passwordRecoveryRepository: PasswordRecoveryRepository
let usersRepository: UsersRepository
let sut: PasswordRecoveryConfirmCodeUseCase

describe('Password Recovery Use Case', () => {
	beforeEach(() => {
		passwordRecoveryRepository = new InMemoryPasswordRecoveryRepository()
		usersRepository = new InMemoryUsersRepository()
		sut = new PasswordRecoveryConfirmCodeUseCase(
			passwordRecoveryRepository,
			usersRepository,
		)
	})

	it('should be able to confirm a recovery code', async () => {
		const user = await usersRepository.create({
			email: 'janedoe@gmail.com',
			password_hash: await hash('123456', 8),
		})

		const passwordRecovery = await passwordRecoveryRepository.create({
			code: '123456',
			user_id: user.id,
		})

		const { token } = await sut.execute({
			email: user.email,
			code: passwordRecovery.code,
		})

		expect(token).toBeDefined()
	})

	it('should not be able to confirm a recovery code for a non-existing user', async () => {
		await expect(
			sut.execute({ email: 'nonExistingUser', code: '123456' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to confirm a recovery code for a non-existing password recovery', async () => {
		const user = await usersRepository.create({
			email: 'janedoe@gmail.com',
			password_hash: await hash('123456', 8),
		})

		await expect(
			sut.execute({ email: user.email, code: '123456' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should reject the confirmation of a recovery code with an invalid code', async () => {
		const user = await usersRepository.create({
			email: 'janedoe@gmail.com',
			password_hash: await hash('123456', 8),
		})

		await passwordRecoveryRepository.create({
			code: '123456',
			user_id: user.id,
		})

		await expect(
			sut.execute({ email: user.email, code: 'invalidCode' }),
		).rejects.toBeInstanceOf(InvalidCodeError)
	})
})
