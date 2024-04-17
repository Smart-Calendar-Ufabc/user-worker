import { SessionsRepository } from '../repositories/sessions-repository'

interface DeleteSessionRequest {
	userId: string
}

export class DeleteSessionUseCase {
	constructor(private sessionsRepository: SessionsRepository) {}

	async execute({ userId }: DeleteSessionRequest): Promise<void> {
		const sessions = await this.sessionsRepository.findManyByUserId(userId)

		if (sessions.length === 0) {
			return
		}

		await this.sessionsRepository.deleteByUserId(userId)
	}
}
