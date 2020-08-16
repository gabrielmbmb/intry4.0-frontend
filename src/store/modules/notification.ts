import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';

export interface INotificationState {
  unseen: object[];
}

@Module({ dynamic: true, store, name: 'notification' })
class Notification extends VuexModule implements INotificationState {
  public unseen: { [key: string]: any }[] = [];

  @Mutation
  private ADD_NOTIFICATION(notification: object) {
    this.unseen.push(notification);
  }

  @Mutation
  private REMOVE_NOTIFICATION(id: string) {
    const index = this.unseen.findIndex(
      (notification) => notification.id === id
    );
    this.unseen.splice(index, 1);
  }

  @Action({ rawError: true })
  public addNotification(notification: object) {
    this.ADD_NOTIFICATION(notification);
  }

  @Action({ rawError: true })
  public removeNotification(id: string) {
    this.REMOVE_NOTIFICATION(id);
  }
}

export const NotificationModule = getModule(Notification);
