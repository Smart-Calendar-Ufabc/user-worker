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
	code: string
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

		const userTemp = await this.usersTempRepository.findUniqueByEmail(email)

		if (userTemp) {
			await this.usersTempRepository.delete(userTemp.id)
		}

		const userTempCreated = await this.usersTempRepository.create({
			email,
			password_hash: await hash(password, salt),
			code,
		})

		// send email with code

		return {
			userTemp: userTempCreated,
			code,
		}
	}
}
