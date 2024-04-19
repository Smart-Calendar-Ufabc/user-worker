import { PrismaPasswordRecoveryRepository } from '../../repositories/prisma/prisma-password-recovery-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { PasswordRecoverySendCodeUseCase } from '../password-recovery-send-code'

export function makePasswordRecoverySendCodeUseCase({
	databaseConnectionString,
	isLocalhost,
}: {
	databaseConnectionString: string
	isLocalhost?: boolean
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaPasswordRecoveryRepository = new PrismaPasswordRecoveryRepository(
		options,
	)
	const prismaUsersRepository = new PrismaUsersRepository(options)

	const updateOnboardingUseCase = new PasswordRecoverySendCodeUseCase(
		prismaPasswordRecoveryRepository,
		prismaUsersRepository,
		isLocalhost,
	)

	return updateOnboardingUseCase
}
