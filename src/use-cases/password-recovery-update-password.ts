import { PasswordRecoveryRepository } from "../repositories/password-recovery-repository";
import { UsersRepository } from "../repositories/users-repository";
import { PasswordDoesNotMatchError } from "./errors/PasswordDoesNotMatchError";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface PasswordRecoveryUpdatePasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export class PasswordRecoveryUpdatePasswordUseCase {
  constructor(
    private passwordRecoveryRepository: PasswordRecoveryRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({token, confirmPassword, newPassword}: PasswordRecoveryUpdatePasswordRequest): Promise<void> {
    const passwordRecovery = await this.passwordRecoveryRepository.findByToken(token);

    if (!passwordRecovery) {
      throw new ResourceNotFoundError();
    }

    if (confirmPassword !== newPassword) {
      throw new PasswordDoesNotMatchError();
    }

    await this.userRepository.update(passwordRecovery.user_id, {password_hash: newPassword})
  }
}