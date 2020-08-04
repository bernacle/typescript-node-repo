import { container } from "tsyringe";
import mailConfig from "@config/mail";

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";
import IMailProvider from "./MailProvider/models/IMailProvider";
import SESMailprovider from "./MailProvider/implementations/SESMailprovider";
import IMailTemplateProvider from "./MailTemplateProvider/models/IMailTemplateProvider";
import HandlebarsMailTemplateProvider from "./MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";
import EtherealMailProvider from "./MailProvider/implementations/EherealMailProvider";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  "MailTemplateProvider",
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  "MailProvider",
  mailConfig.driver === "ethereal"
    ? container.resolve(EtherealMailProvider)
    : container.resolve(SESMailprovider),
);
