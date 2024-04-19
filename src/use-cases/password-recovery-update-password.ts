import { genSalt, hash } from 'bcryptjs'
import { PasswordRecoveryRepository } from '../repositories/password-recovery-repository'
import { UsersRepository } from '../repositories/users-repository'
import { PasswordDoesNotMatchError } from './errors/PasswordDoesNotMatchError'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

interface PasswordRecoveryUpdatePasswordRequest {
	token: string
	newPassword: string
	confirmPassword: string
}

export class PasswordRecoveryUpdatePasswordUseCase {
	constructor(
		private passwordRecoveryRepository: PasswordRecoveryRepository,
		private userRepository: UsersRepository,
	) {}

	async execute({
		token,
		confirmPassword,
		newPassword,
	}: PasswordRecoveryUpdatePasswordRequest): Promise<void> {
		const passwordRecovery =
			await this.passwordRecoveryRepository.findUniqueByToken(token)

		if (!passwordRecovery) {
			throw new ResourceNotFoundError()
		}

		if (confirmPassword !== newPassword) {
			throw new PasswordDoesNotMatchError()
		}

		const salt = await genSalt(10)

		await this.userRepository.update(passwordRecovery.user_id, {
			password_hash: await hash(newPassword, salt),
		})

		await this.passwordRecoveryRepository.delete(passwordRecovery.id)
	}
}
