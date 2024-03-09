import {PasswordRecoveryRepository} from '../repositories/password-recovery-repository';
import { UsersRepository } from '../repositories/users-repository';
import { InvalidCodeError } from './errors/InvalidCodeError';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';

interface PasswordRecoveryConfirmCodeRequest {
  email: string;
  code: string;
}

interface PasswordRecoveryConfirmCodeResponse {
  token: string;
}


export class PasswordRecoveryConfirmCodeUseCase {
  constructor(
    private passwordRecoveryRepository: PasswordRecoveryRepository, 
    private usersRepository: UsersRepository
  ) {}

  async execute({email, code}: PasswordRecoveryConfirmCodeRequest): Promise<PasswordRecoveryConfirmCodeResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const passwordRecovery = await this.passwordRecoveryRepository.findByUserId(user.id);

    if (!passwordRecovery) {
      throw new ResourceNotFoundError();
    }

    if (passwordRecovery.code !== code) {
      throw new InvalidCodeError();
    }

    const token = crypto.randomUUID();

    await this.passwordRecoveryRepository.update(passwordRecovery.id, {token});

    return {token};
  }
}