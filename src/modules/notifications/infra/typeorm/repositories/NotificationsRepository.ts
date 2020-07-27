import { getMongoRepository, MongoRepository } from "typeorm";

import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import Notification from "@modules/notifications/infra/typeorm/schemas/Notification";

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // se precisa se conectar com um banco q não seja o default, deve se passar o nome da conexão
    this.ormRepository = getMongoRepository(Notification, "mongo");
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
