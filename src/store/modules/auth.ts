import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import backendAPI from '@/api/backend.service';
import { AxiosResponse } from 'axios';
import { getToken, setToken, removeToken } from '@/utils/cookies';

export interface IAuthState {
  accessToken: string;
  expiresIn: number;
  name: string;
  email: string;
  isStaff: boolean;
  isSuperUser: boolean;
}

@Module({ dynamic: true, store, name: 'auth' })
class Auth extends VuexModule implements IAuthState {
  public accessToken = getToken() || '';

  public expiresIn = 0;

  public name = '';

  public email = '';

  public isStaff = false;

  public isSuperUser = false;

  @Mutation
  public SET_TOKEN(token: string) {
    this.accessToken = token;
  }

  @Mutation
  public SET_EXPIRES_IN(expiresIn: number) {
    this.expiresIn = expiresIn;
  }

  @Action({ rawError: true })
  public async login(userInfo: { email: string; password: string }) {
    const { email, password } = userInfo;
    const { data } = (await backendAPI.doLogin(
      email,
      password
    )) as AxiosResponse;
    setToken(data.access_token);
    this.SET_TOKEN(data.access_token);
    this.SET_EXPIRES_IN(data.expires_in);
  }

  @Action({ rawError: true })
  public async logout() {
    if (this.accessToken === '') {
      throw Error('Logout: token is undefined!');
    }

    await backendAPI.doLogout(this.accessToken);
    removeToken();
    this.SET_TOKEN('');
    this.SET_EXPIRES_IN(0);
  }
}

export const AuthModule = getModule(Auth);
