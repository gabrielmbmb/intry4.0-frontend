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

// Empty store first, register dinamically all modules later.
export default new Vuex.Store<IRootState>({});
