import { Profile, User } from '@prisma/client/edge'
import { UsersRepository } from '../repositories/users-repository'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'
import { compare } from 'bcryptjs'
import { SessionsRepository } from '../repositories/sessions-repository'

interface AuthenticateRequest {
	email: string
	password: string
}

interface AuthenticateResponse {
	user: User
	token: string
	profile: Profile | null
}

export class AuthenticateUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private sessionsRepository: SessionsRepository,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateRequest): Promise<AuthenticateResponse> {
		const user = await this.usersRepository.findUniqueByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesMatchPassword = await compare(password, user.password_hash)

		if (!doesMatchPassword) {
			throw new InvalidCredentialsError()
		}

		const token = crypto.randomUUID()

		await this.sessionsRepository.create({
			token,
			user_id: user.id,
		})

		return {
			user,
			profile: user.profile,
			token,
		}
	}
}
