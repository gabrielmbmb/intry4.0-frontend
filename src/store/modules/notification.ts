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
  public unseen: object[] = [];

  @Mutation
  private ADD_NOTIFICATION(notification: object) {
    this.unseen.push(notification);
  }

  @Mutation REMOVE_NOTIFICATION() {
    //
  }

  @Action({ rawError: true })
  public addNotification(notification: object) {
    this.ADD_NOTIFICATION(notification);
  }

  @Action({ rawError: true })
  public removeNotification(notification: object) {
    //
  }
}

export const NotificationModule = getModule(Notification);
