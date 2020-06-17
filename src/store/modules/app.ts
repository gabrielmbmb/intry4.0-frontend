import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies';

export interface IAppState {
  sidebar: {
    opened: boolean;
  };
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
  };

  @Mutation
  private TOGGLE_SIDEBAR() {
    this.sidebar.opened = !this.sidebar.opened;

    if (this.sidebar.opened) {
      setSidebarStatus('opened');
    } else {
      setSidebarStatus('closed');
    }
  }

  @Action({ rawError: true })
  public toggleSidebar() {
    this.TOGGLE_SIDEBAR();
  }
}

export const AppModule = getModule(App);
