import {PasswordRecoveryRepository} from '../repositories/password-recovery-repository';
import { UsersRepository } from '../repositories/users-repository';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';

interface PasswordRecoverySendCodeRequest {
  email: string;
}

interface PasswordRecoverySendCodeResponse {
  code: string;
}

export class PasswordRecoverySendCodeUseCase {
  constructor(
    private passwordRecoveryRepository: PasswordRecoveryRepository, 
    private usersRepository: UsersRepository
  ) {}

  async execute({email}: PasswordRecoverySendCodeRequest): Promise<PasswordRecoverySendCodeResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    // Generate a random 5 characters string
    const code = Math.random().toString(36).substring(2, 7); 

    // TODO: Refactor, send the code to the user's email

    await this.passwordRecoveryRepository.create({
      code,
      user_id: user.id
    })

    return { code };
  }
}