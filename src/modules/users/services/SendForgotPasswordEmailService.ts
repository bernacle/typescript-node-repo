import { injectable, inject } from "tsyringe";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import AppError from "@shared/errors/AppError";
import IUserRepository from "../repositories/IUsersRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository") private usersRepository: IUserRepository,
    @inject("MailProvider") private mailprovider: IMailProvider,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
  ) { }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists");
    }

    await this.userTokensRepository.generate(user.id);

    this.mailprovider.sendMail(email, "Fake Email");
  }
}

export default SendForgotPasswordEmailService;
