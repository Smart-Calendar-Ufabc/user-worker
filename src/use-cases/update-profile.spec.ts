import {beforeEach, describe, expect, it} from 'vitest'

import { hash } from 'bcryptjs';
import { ProfilesRepository } from '../repositories/profiles-repository';
import { CreateProfileUseCase } from './create-profile';
import { InMemoryProfilesRepository } from '../repositories/in-memory/in-memory-profiles-repository';
import { UsersRepository } from '../repositories/users-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { UpdateProfileUseCase } from './update-profile';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';

let profilesRepository: ProfilesRepository;
let usersRepository: UsersRepository;
let sut: UpdateProfileUseCase;

describe('Update Profile Use Case', () => {
  beforeEach(() => {
    profilesRepository = new InMemoryProfilesRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateProfileUseCase(profilesRepository);
  })

  it('should be able to update an existent profile', async() => {
    const user = await usersRepository.create({
      email: 'janedoe@email.com',
      password_hash: await hash('N@ruto123', 8)
    })

    const profileCreated = await profilesRepository.create({
      name: 'Jane Doe',
      avatar_image_url: 'http://avatar.com/avatar.jpg',
      user_id: user.id
    })


    const {profile} = await sut.execute({
      id: profileCreated.id,
      name: 'Jane Doe',
      avatar: 'http://avatar.com/avatar.jpg',
    })

    expect(profile.id).toBeDefined();
  })

  it('should not be able to update inexistent profile', async() => {
    await expect(sut.execute({
      id: 'inexistent-id',
      name: 'Jane Doe',
      avatar: 'http://avatar.com/avatar.jpg',
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})