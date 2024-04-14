import { User } from '@prisma/client/edge'
import { UsersRepository } from '../repositories/users-repository'
import { UsersTempRepository } from '../repositories/users-temp-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { InvalidCodeError } from './errors/InvalidCodeError'

interface CreateUserRequest {
	code: string
	email: string
}

interface CreateUserResponse {
	user: User
}

export class CreateUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private usersTempRepository: UsersTempRepository,
	) {
		this.usersRepository = usersRepository
		this.usersTempRepository = usersTempRepository
	}

	async execute({
		code,
		email,
	}: CreateUserRequest): Promise<CreateUserResponse> {
		const userTemp = await this.usersTempRepository.findUniqueByEmail(email)

		if (!userTemp) {
			throw new ResourceNotFoundError()
		}

		if (userTemp.code !== code) {
			throw new InvalidCodeError()
		}

		const user = await this.usersRepository.create({
			email: userTemp.email,
			password_hash: userTemp.password_hash,
		})

		await this.usersTempRepository.delete(userTemp.id)

		return {
			user,
		}
	}
}
