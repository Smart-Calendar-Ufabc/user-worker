import {beforeEach, describe, expect, it} from 'vitest'

import { UsersRepository } from "../repositories/users-repository";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError';

let usersRepository: UsersRepository;
let sut: RegisterUseCase;

describe('Register User Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  })

  it('should be able to register a new user', async() => {
    const {user} = await sut.execute({
      email: 'janedoe@email.com',
      password: 'N@ruto123'
    })

    expect(user.id).toBeDefined();
  })

  it('should hash user password upon registration', async() => {
    const {user} = await sut.execute({
      email: 'janedoe@email.com',
      password: 'N@ruto123'
    })

    const isPasswordCorrectlyHashed = await compare('N@ruto123', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  })

  it('should not be able to register a new user with same email twice', async() => {
    await sut.execute({
      email: 'janedoe@email.com',
      password: 'N@ruto123'
    })

    await expect(sut.execute({
      email: 'janedoe@email.com',
      password: 'N@ruto123'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})