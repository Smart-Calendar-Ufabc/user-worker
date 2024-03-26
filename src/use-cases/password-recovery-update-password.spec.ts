import { beforeEach, describe, expect, it } from "vitest";
import { PasswordRecoveryRepository } from "../repositories/password-recovery-repository";
import { UsersRepository } from "../repositories/users-repository";
import { PasswordRecoveryUpdatePasswordUseCase } from "./password-recovery-update-password";
import { InMemoryPasswordRecoveryRepository } from "../repositories/in-memory/in-memory-password-recovery-repository";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { PasswordDoesNotMatchError } from "./errors/PasswordDoesNotMatchError";

let passwordRecoveryRepository: PasswordRecoveryRepository;
let usersRepository: UsersRepository;
let sut: PasswordRecoveryUpdatePasswordUseCase;

describe('Password Recovery Update Password Use Case', () => {
  beforeEach(() => {
    passwordRecoveryRepository = new InMemoryPasswordRecoveryRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new PasswordRecoveryUpdatePasswordUseCase(passwordRecoveryRepository, usersRepository);
  })

  it('should be able to update the user password', async () => {
    const initialPasswordHash = await hash('12345678', 8)
    const user = await usersRepository.create({
      email: 'janedoe@gmail.com',
      password_hash: initialPasswordHash
    })

    const token = crypto.randomUUID();

    await passwordRecoveryRepository.create({
      code: '123456',
      user_id: user.id,
      token,
    })

    await sut.execute({
      token,
      newPassword: 'newPassword',
      confirmPassword: 'newPassword'
    })

    const updatedUser = await usersRepository.findUniqueByEmail(user.email);

    expect(updatedUser?.password_hash).not.toBe(initialPasswordHash);
  });

  it('should not be able to update the user password if the token does not exist', async () => {
    await expect(sut.execute({
      token: 'invalid-token',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword'
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update the user password if the password does not match', async () => {
    const initialPasswordHash = await hash('12345678', 8)
    const user = await usersRepository.create({
      email: 'janedoe@gmail.com',
      password_hash: initialPasswordHash
    })

    const token = crypto.randomUUID();

    await passwordRecoveryRepository.create({
      code: '123456',
      user_id: user.id,
      token,
    })

    await expect(sut.execute({
      token,
      newPassword: 'newPassword',
      confirmPassword: 'invalidPassword'
    })).rejects.toBeInstanceOf(PasswordDoesNotMatchError);
  })
});