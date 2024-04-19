import { PrismaPasswordRecoveryRepository } from '../../repositories/prisma/prisma-password-recovery-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { PasswordRecoveryUpdatePasswordUseCase } from '../password-recovery-update-password'

export function makePasswordRecoveryUpdatePasswordUseCase({
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

	const updateOnboardingUseCase = new PasswordRecoveryUpdatePasswordUseCase(
		prismaPasswordRecoveryRepository,
		prismaUsersRepository,
	)

	return updateOnboardingUseCase
}
