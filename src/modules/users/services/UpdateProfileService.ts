import AppError from "@shared/errors/AppError";
import { injectable, inject } from "tsyringe";
import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";
import User from "../infra/typeorm/entities/User";
import IUserRepository from "../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject("UsersRepository") private usersRepository: IUserRepository,
    @inject("HashProvider") private hashProvider: IHashProvider,
  ) { }

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found");
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError("Email already in use");
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError("Old password was not informed");
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
