import Vue from 'vue';
import Vuex from 'vuex';
import { IAuthState } from './modules/auth';
import { IPermissionsState } from './modules/permission';
import { IAppState } from './modules/app';

Vue.use(Vuex);

export interface IRootState {
  auth: IAuthState;
  permission: IPermissionsState;
  app: IAppState;
}

export default new Vuex.Store<IRootState>({});
