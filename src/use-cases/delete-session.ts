import { SessionsRepository } from '../repositories/sessions-repository'

interface DeleteSessionRequest {
	userId: string
	token: string
}

export class DeleteSessionUseCase {
	constructor(private sessionsRepository: SessionsRepository) {}

	async execute({ userId, token }: DeleteSessionRequest): Promise<void> {
		await this.sessionsRepository.deleteByUserIdAndToken(userId, token)
	}
}
