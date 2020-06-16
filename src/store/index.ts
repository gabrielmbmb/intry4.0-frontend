import Vue from 'vue';
import Vuex from 'vuex';
import { IAuthState } from './modules/auth';
import { IPermissionsState } from './modules/permission';

Vue.use(Vuex);

export interface IRootState {
  auth: IAuthState;
  permission: IPermissionsState;
}

export default new Vuex.Store<IRootState>({});
