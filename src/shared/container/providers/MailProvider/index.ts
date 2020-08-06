import { container } from "tsyringe";

import mailConfig from "@config/mail";
import IMailProvider from "./models/IMailProvider";

import EherealMailProvider from "./implementations/EherealMailProvider";
import SESMailprovider from "./implementations/SESMailprovider";

const providers = {
  ethereal: container.resolve(EherealMailProvider),
  ses: container.resolve(SESMailprovider),
};

container.registerInstance<IMailProvider>(
  "MailProvider",
  providers[mailConfig.driver],
);
