<template lang="pug">
div.app-container
  h2 Anomaly Detection Models
  el-row(:gutter="20")
    el-col(:span="24")
      el-table(
        :default-sort="{ prop: 'id', order: 'ascending' }"
        :data="datamodels"
        @row-click="onRowClick"
        :key="tableKey"
      )
        el-table-column(
          prop="id"
          label="ID"
          width="50"
          :show-overflow-tooltip="true"
        )
        el-table-column(
          prop="name"
          label="Name"
          width="100"
        )
        el-table-column(
          prop="is_training"
          label="Training"
          width="80"
        )
          template(slot-scope="scope")
            p {{ scope.row.is_training ? 'Yes' : 'No' }}
        el-table-column(
          prop="date_trained"
          label="Date trained"
          width="220"
        )
          template(slot-scope="scope")
            p {{ scope.row.date_trained ? formatDatex(scope.row.date_trained) : 'No training date' }}
        el-table-column(
          prop="is_active"
          label="Active"
          width="75"
        )
          template(slot-scope="scope")
            p {{ scope.row.deployed ? 'Yes' : 'No' }}
        el-table-column(
          prop="date_deployed"
          label="Date deployed"
          width="220"
        )
          template(slot-scope="scope")
            p {{ scope.row.date_deployed ? formatDatex(scope.row.date_deployed) : 'No deploying date' }}
        el-table-column(
          prop="num_predictions"
          label="Num. of predictions"
          :show-overflow-tooltip="true"
          width="160"
        )
        el-table-column(
          prop="training_progress"
          label="Training progress"
        )
          template(slot-scope="scope")
            div(v-if="Object.keys(trainProgress).length > 0")
              div(v-if="trainProgress[scope.row.id] === null")
                p No training status
              div(v-else-if="Object.keys(trainProgress[scope.row.id]).length === 0")
                p Loading...
              div(v-else)
                el-progress(:percentage="trainProgress[scope.row.id].current")
                p {{ trainProgress[scope.row.id].status }}
        el-table-column(
          prop="buttons"
        )
          template(slot-scope="scope")
            el-button(
              size="mini"
              @click="deployDatamodel(scope.row)"
              :disabled="scope.row.is_training || !scope.row.trained"
            ) {{ scope.row.deployed ? 'Set unactive' : 'Set active' }}
            el-button(
              size="mini"
              @click="trainModel(scope.row)"
              style="margin-left: 10px;"
              :disabled="scope.row.is_training"
            ) {{ scope.row.trained ? 'Retrain' : 'Train' }}
            el-popconfirm(
              title="Are you sure you want to remove this user?"
              confirmButtonText="Yes"
              cancelButtonText="No"
              confirmButtonType="danger"
              @onConfirm="deleteDatamodel(scope.row)"
            )
              el-button(
                slot="reference"
                size="mini"
                type="danger"
                style="margin-left: 10px;"
              ) Remove
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import backendService from '@/api/backend.service';
import EventBus from '@/utils/eventBus';
import { AxiosResponse } from 'axios';
import formatDate from '@/utils/date';
import { AuthModule } from '../../store/modules/auth';
import { DatamodelModule } from '../../store/modules/datamodel';

const MODEL_TRAIN_STATE_REFRESH_RATE = 5000;

@Component({})
export default class Models extends Vue {
  public trainProgress: { [key: string]: any } = {};

  public tableKey = 0;

  public intervals: NodeJS.Timeout[] = [];

  public get datamodels() {
    return DatamodelModule.datamodels;
  }

  public activated() {
    this.getDatamodels();
    EventBus.$on('update-models', () => this.getDatamodels());
  }

  public deactivated() {
    this.clearIntervals();
  }

  public async getDatamodels() {
    await DatamodelModule.getDatamodels();
    this.datamodels.forEach((datamodel: any) => {
      if (datamodel.task_status) {
        this.trainProgress[datamodel.id] = {};
        this.getTaskStatus(datamodel.id);
        const interval = setInterval(() => {
          if (
            Object.keys(this.trainProgress[datamodel.id]).length === 0 ||
            this.trainProgress[datamodel.id].state === 'PROGRESS'
          ) {
            this.getTaskStatus(datamodel.id);
          } else if (this.trainProgress[datamodel.id].state === 'SUCCESS') {
            const datamodelIndex = this.datamodels.findIndex(
              (model: any) => model.id === datamodel.id
            );
            this.$set(this.datamodels[datamodelIndex], 'is_training', false);
            this.$set(this.datamodels[datamodelIndex], 'trained', true);
          }
        }, MODEL_TRAIN_STATE_REFRESH_RATE);
        this.intervals.push(interval);
      } else {
        this.trainProgress[datamodel.id] = null;
      }
    });
  }

  public clearIntervals() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }

  public getTaskStatus(id: string) {
    backendService
      .getTaskStatus(id, AuthModule.accessToken)
      .then((res) => {
        const { data } = res as AxiosResponse;
        this.trainProgress[id] = data;
        this.tableKey += 1;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public onRowClick(datamodel: any, column: any) {
    if (column.property !== 'buttons') {
      this.$router.push({ path: `/models/${datamodel.id}/detail` });
    }
  }

  public deployDatamodel(datamodel: any) {
    backendService
      .deployDatamodel(datamodel.id, AuthModule.accessToken)
      .then(() => {
        this.clearIntervals();
        this.getDatamodels();
      })
      .catch((err) => console.log(err));
  }

  public deleteDatamodel(datamodel: any) {
    backendService
      .deleteDatamodel(datamodel.id, AuthModule.accessToken)
      .then(() => {
        // this.getDatamodels();
        this.$notify({
          title: 'Datamodel removed',
          message: `The datamodel ${datamodel.name} has been removed`,
          type: 'success',
        });
      });
  }

  public trainModel(datamodel: any) {
    this.$router.push(`/models/${datamodel.id}/train`);
  }

  public formatDatex(date: string): string {
    return formatDate(date, 'YYYY-MM-D HH:mm:ss');
  }
}
</script>
