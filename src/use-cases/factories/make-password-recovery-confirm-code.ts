import { PrismaPasswordRecoveryRepository } from '../../repositories/prisma/prisma-password-recovery-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { PasswordRecoveryConfirmCodeUseCase } from '../password-recovery-confirm-code'

export function makePasswordRecoveryConfirmCodeUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaPasswordRecoveryRepository = new PrismaPasswordRecoveryRepository(
		options,
	)
	const prismaUsersRepository = new PrismaUsersRepository(options)

	const updateOnboardingUseCase = new PasswordRecoveryConfirmCodeUseCase(
		prismaPasswordRecoveryRepository,
		prismaUsersRepository,
	)

	return updateOnboardingUseCase
}
