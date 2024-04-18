import { UsersRepository } from '../repositories/users-repository'

interface UpdateOnboardingRequest {
	userId: string
}

export class UpdateOnboardingUseCase {
	constructor(private usersRepository: UsersRepository) {
		this.usersRepository = usersRepository
	}

	async execute({ userId }: UpdateOnboardingRequest): Promise<void> {
		await this.usersRepository.update(userId, {
			onboarding_completed: true,
		})
	}
}
