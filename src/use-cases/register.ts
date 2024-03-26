import { User } from "@prisma/client/edge";
import { hash } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({email, password}: RegisterRequest): Promise<RegisterResponse> {
    const password_hash = await hash(password, 8);

    const userWithSameEmail = await this.usersRepository.findUniqueByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      email,
      password_hash
    })

    return {
      user
    }
  }
}