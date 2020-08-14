import Vue from 'vue';
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import backendService from '@/api/backend.service';
import { AxiosResponse } from 'axios';
import { AuthModule } from './auth';
import { NotificationModule } from './notification';

export interface IDatamodelState {
  datamodels: object[];
  predictions: object[];
}

@Module({ dynamic: true, store, name: 'datamodel' })
class Datamodel extends VuexModule implements IDatamodelState {
  public datamodels: object[] = [];

  public predictions: object[] = [];

  @Mutation
  private SET_DATAMODELS(datamodels: object[]) {
    this.datamodels = datamodels;
  }

  @Mutation
  private SET_PREDICTIONS(predictions: object[]) {
    this.predictions = predictions;
  }

  @Mutation
  private ADD_PREDICTION(prediction: object) {
    this.predictions.push(prediction);
  }

  @Mutation
  private UPDATE_PREDICTION(prediction: { [key: string]: any }, index: number) {
    Vue.set(this.predictions, index, prediction);
    console.log(prediction.predictions);
    // Check if any model has predicted an anomaly. If so, create a notification.
    if (Object.values(prediction.predictions).some((pred) => pred)) {
      NotificationModule.addNotification({
        id: prediction.id,
        icon: 'brain',
        message: `New anomaly detected`,
      });
    }
  }

  @Action({ rawError: true })
  public async getDatamodels() {
    const { data } = (await backendService.getDatamodels(
      AuthModule.accessToken
    )) as AxiosResponse;
    this.SET_DATAMODELS(data);
  }

  @Action({ rawError: true })
  public async getPredictions() {
    const { data } = (await backendService.getPredictions(
      AuthModule.accessToken
    )) as AxiosResponse;
    this.SET_PREDICTIONS(data);
  }

  @Action({ rawError: true })
  public SOCKET_prediction(msg: any) {
    const index = this.predictions.findIndex(
      (prediction: any) => prediction.id === msg.id
    );
    if (index > -1) {
      this.UPDATE_PREDICTION(msg, index);
    } else {
      this.ADD_PREDICTION(msg);
    }
  }
}

export const DatamodelModule = getModule(Datamodel);
