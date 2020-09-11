<template lang="pug">
div
  div.table-buttons
    el-popconfirm(
      :title="`Are you sure you want to acknowledge the ${this.selectedPredictions.length} selected predictions?`"
      confirmButtonText="Yes"
      cancelButtonText="No"
      confirmButtonType="success"
      @onConfirm="ackSelectedPredictions"
    )
      el-button(
        type="primary"
        slot="reference"
        :disabled="this.selectedPredictions.length <= 0"
      ) Acknowledge selected predictions
  el-table(
    :data="predictions"
    :max-height="tableMaxHeight || 'auto'"
    :default-sort="{prop: 'predictions_received_on', order: 'descending'}"
    stripe
    @selection-change="handleSelection"
    @row-click="onRowClick"
  )
    el-table-column(
      prop="selection"
      type="selection"
      width="50"
    )
    el-table-column(
      prop="id"
      label="ID"
      width="50"
      :show-overflow-tooltip="true"
    )
    el-table-column(
      prop="datamodel"
      label="Datamodel"
      width="150"
      sortable
    )
      template(
        v-if="datamodels.length > 0"
        slot-scope="scope"
      )
        router-link(
          :to="`/models/${datamodelOfPrediction(scope.row.datamodel).id}/detail`"
        ) {{ datamodelOfPrediction(scope.row.datamodel).name }}
    el-table-column(
      prop="created_on"
      label="Created on"
      width="150"
      :sortable="true"
    )
      template(slot-scope="scope")
        p {{ scope.row.created_on | formatDate }}
    el-table-column(
      prop="predictions_received_on"
      label="Predictions received at"
      width="205"
      :sortable="true"
    )
      template(slot-scope="scope")
        p(v-if="scope.row.predictions_received_on")
          | {{ scope.row.predictions_received_on | formatDate }}
        p(v-else) Prediction not received yet
    el-table-column(
      prop="data"
      label="Data"
      width="420"
    )
      template(slot-scope="scope")
        ul(style="margin-left: 10px; padding-left: 0;")
          li(
           v-for="column in scope.row.data['columns']"
           :key="column"
          )
            strong {{ column }}:
            |  {{ scope.row.data['data'][0][scope.row.data['columns'].indexOf(column)] }}
    el-table-column(
      prop="predictions"
      label="Predictions"
    )
      template(slot-scope="scope")
        div(
          v-if="Object.keys(scope.row.predictions).length > 0",
          style="margin-left: 10px;"
        )
          ul
          div(v-if="'pca_mahalanobis' in scope.row.predictions")
            li
              strong PCA + Mahalanobis: 
              | {{ scope.row.predictions.pca_mahalanobis }}
          div(v-if="'autoencoder' in scope.row.predictions")
            li
              strong Autoencoder: 
              | {{ scope.row.predictions.autoencoder }}
          div(v-if="'kmeans' in scope.row.predictions")
            li
              strong k-Means: 
              | {{ scope.row.predictions.kmeans }}
          div(v-if="'one_class_svm' in scope.row.predictions")
            li
              strong One Class SVM: 
              | {{ scope.row.predictions.one_class_svm }}
          div(v-if="'isolation_forest' in scope.row.predictions")
            li
              strong Isolation Forest: 
              | {{ scope.row.predictions.isolation_forest }}
          div(v-if="'local_outlier_factor' in scope.row.predictions")
            li
              strong Local Outlier Factor: 
              | {{ scope.row.predictions.local_outlier_factor }}
          div(v-if="'gaussian_distribution' in scope.row.predictions")
            li
              strong Gaussian Distribution: 
              | {{ scope.row.predictions.gaussian_distribution }}
          div(v-if="'knearest_neighbors' in scope.row.predictions")
            li
              strong k-Nearest Neighbors: 
              | {{ scope.row.predictions.knearest_neighbors }}
        div(v-else)
          p Predictions not received yet
    el-table-column(
      prop="user_ack"
      label="User acknowledge"
      width="180"
      sortable
    )
      template(slot-scope="scope")
        p {{ scope.row.user_ack || 'No ACK' }}
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import formatDate from '@/utils/date';
import backendService from '../../api/backend.service';
import { AuthModule } from '../../store/modules/auth';

@Component({
  name: 'PredictionTable',
  filters: {
    prettify(value: object) {
      return JSON.stringify(value, null, 2);
    },
    formatDate(value: string) {
      return formatDate(value, 'YYYY-MM-D HH:mm:ss');
    },
  },
})
export default class extends Vue {
  @Prop() public predictions!: { [key: string]: string }[];

  @Prop() public datamodels!: { [key: string]: string }[];

  @Prop({ default: 0 }) public tableMaxHeight!: number;

  public selectedPredictions: { [key: string]: any }[] = [];

  public datamodelOfPrediction(id: string) {
    if (this.datamodels) {
      const datamodelOfPrediction = this.datamodels.find(
        (datamodel: { [key: string]: any }) => datamodel.id === id
      );
      if (datamodelOfPrediction) {
        return datamodelOfPrediction;
      }
    }

    return {
      name: '',
      id: '',
    };
  }

  public handleSelection(selected: { [key: string]: any }[]) {
    this.selectedPredictions = selected.filter((prediction) => !prediction.ack);
  }

  public async ackSelectedPredictions() {
    const promises: Promise<any>[] = [];
    this.selectedPredictions.forEach((prediction) => {
      if (!prediction.ack) {
        promises.push(
          backendService.ackPrediction(prediction.id, AuthModule.accessToken)
        );
      }
    });
    Promise.all(promises).then(() => {
      this.$emit('updatePredictions');
      this.$notify({
        title: 'Predictions',
        message: `The ${this.selectedPredictions.length} selected predictions has been ACKed`,
        type: 'success',
      });
    });
  }

  public onRowClick(row: any, column: any) {
    if (!['selection', 'datamodel'].includes(column.property)) {
      this.$router.push(`/prediction/${row.id}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.table-buttons {
  margin-top: 15px;
}
</style>
