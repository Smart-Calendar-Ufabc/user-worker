import { beforeEach, describe, expect, it } from '@jest/globals'
import { PasswordRecoveryRepository } from '../repositories/password-recovery-repository'
import { PasswordRecoverySendCodeUseCase } from './password-recovery-send-code'
import { InMemoryPasswordRecoveryRepository } from '../repositories/in-memory/in-memory-password-recovery-repository'
import { UsersRepository } from '../repositories/users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

let passwordRecoveryRepository: PasswordRecoveryRepository
let usersRepository: UsersRepository
let sut: PasswordRecoverySendCodeUseCase

describe('Password Recovery Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		passwordRecoveryRepository = new InMemoryPasswordRecoveryRepository()
		sut = new PasswordRecoverySendCodeUseCase(
			passwordRecoveryRepository,
			usersRepository,
		)
	})

	it('should be able to generate a recovery code', async () => {
		const user = await usersRepository.create({
			email: 'janedoe@gmail.com',
			password_hash: await hash('123456', 8),
		})

		const code = await sut.execute({ email: user.email })

		expect(code).toBeDefined()
	})

	it('should not be able to generate a recovery code for a non-existing user', async () => {
		await expect(
			sut.execute({ email: 'nonExistingUserEmail' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
