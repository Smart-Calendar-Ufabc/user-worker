import { UserTemp } from '@prisma/client/edge'
import { UsersTempRepository } from '../repositories/users-temp-repository'
import { genSalt, hash } from 'bcryptjs'
import { generateSixDigitCode } from '../factories/generate-six-digit-code'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'

interface CreateUserTempRequest {
	email: string
	password: string
}

interface CreateUserTempResponse {
	userTemp: UserTemp
}

export class CreateUserTempUseCase {
	constructor(
		private usersTempRepository: UsersTempRepository,
		private usersRepository: UsersRepository,
	) {}

	async execute({
		email,
		password,
	}: CreateUserTempRequest): Promise<CreateUserTempResponse> {
		const userWithSameEmail =
			await this.usersRepository.findUniqueByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const salt = await genSalt(10)
		const code = generateSixDigitCode()
		const userTemp = await this.usersTempRepository.create({
			email,
			password_hash: await hash(password, salt),
			code,
		})

		// send email with code

		return {
			userTemp,
		}
	}
}
