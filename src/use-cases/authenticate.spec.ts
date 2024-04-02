import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";

let usersRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  })

  it('should be able to authenticate', async() => {
    await usersRepository.create({
      email: 'janedoe@email.com',
      password_hash: await hash('N@ruto123', 8)
    })

    const {user} = await sut.execute({
      email: 'janedoe@email.com',
      password: 'N@ruto123'
    })

    expect(user.id).toBeDefined();
  })

  it('should not be able to authenticate with wrong email', async() => {
    await usersRepository.create({
      email: 'janedoe@email.com',
      password_hash: await hash('N@ruto123', 8)
    })

    await expect(sut.execute({
      email: 'ThisIsWrongEmail',
      password: 'N@ruto123'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  
  it('should not be able to authenticate with wrong password', async() => {
    await usersRepository.create({
      email: 'janedoe@email.com',
      password_hash: await hash('N@ruto123', 8)
    })

    await expect(sut.execute({
      email: 'janedoe@email.com',
      password: 'ThisIsTheWrongPassword'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})