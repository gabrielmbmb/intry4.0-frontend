<template lang="pug">
div.app-container
  h2 Prediction
  ul(v-if="prediction")
    li
      strong ID:
      |  {{ prediction.id  }}
    li
      strong Datamodel:
        router-link(:to="`/models/${datamodel.id}/detail`")  {{ datamodel.name }}
    li
      strong Prediction created on:
      |  {{ prediction.created_on | dateFormatting }}
    li
      strong Prediction data:
      ul
        li(
          v-for="column in prediction.data['columns']",
          key="column"
        )
          strong {{ column }}:
          ul
            li Value: {{ prediction.data['data'][0][prediction.data['columns'].indexOf(column)] }}
            li Received at: {{ prediction.dates[column] | dateFormatting }}
    li
      strong Predictions received on:
      |  {{ prediction.predictions_received_on | dateFormatting }}
    li
      strong Predictions:
      ul(v-if="Object.keys(prediction.predictions).length > 0")
        div(v-if="'pca_mahalanobis' in prediction.predictions")
          li
            strong PCA + Mahalanobis: 
            | {{ prediction.predictions.pca_mahalanobis }}
        div(v-if="'autoencoder' in prediction.predictions")
          li
            strong Autoencoder: 
            | {{ prediction.predictions.autoencoder }}
        div(v-if="'kmeans' in prediction.predictions")
          li
            strong k-Means: 
            | {{ prediction.predictions.kmeans }}
        div(v-if="'one_class_svm' in prediction.predictions")
          li
            strong One Class SVM: 
            | {{ prediction.predictions.one_class_svm }}
        div(v-if="'isolation_forest' in prediction.predictions")
          li
            strong Isolation Forest: 
            | {{ prediction.predictions.isolation_forest }}
        div(v-if="'local_outlier_factor' in prediction.predictions")
          li
            strong Local Outlier Factor: 
            | {{ prediction.predictions.local_outlier_factor }}
        div(v-if="'gaussian_distribution' in prediction.predictions")
          li
            strong Gaussian Distribution: 
            | {{ prediction.predictions.gaussian_distribution }}
        div(v-if="'knearest_neighbors' in prediction.predictions")
          li
            strong k-Nearest Neighbors: 
            | {{ prediction.predictions.knearest_neighbors }}
      div(v-else)
        p Predictions not received yet
    li
      strong User ACK:
      |  {{ prediction.user_ack || 'no ACK' }}
    el-popconfirm(
      :title="`Are you sure you want to ACK this prediction?`"
      confirmButtonText="Yes"
      cancelButtonText="No"
      confirmButtonType="success"
      @onConfirm="ackPrediction"
    )
      el-button(
        type="primary"
        slot="reference"
      ) ACK
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import formatDate from '@/utils/date';
import { DatamodelModule } from '../../store/modules/datamodel';
import backendService from '../../api/backend.service';
import { AuthModule } from '../../store/modules/auth';

@Component({
  filters: {
    prettify(value: object) {
      return JSON.stringify(value, null, 2);
    },
    dateFormatting(value: string) {
      return formatDate(value, 'YYYY-MM-D HH:mm:ss');
    },
  },
})
export default class Prediction extends Vue {
  public created() {
    DatamodelModule.getDatamodels();
    DatamodelModule.getPredictions();
  }

  public get prediction() {
    return DatamodelModule.predictions.find(
      (prediction) => prediction.id === this.$route.params.id
    );
  }

  public get datamodel() {
    return DatamodelModule.datamodels.find(
      // eslint-disable-next-line
      (datamodel) => datamodel.id === this.prediction!.datamodel
    );
  }

  public ackPrediction() {
    backendService
      .ackPrediction(this.$route.params.id, AuthModule.accessToken)
      .then(() => {
        this.$notify({
          title: 'Prediction ACK',
          message: `The prediction with ${this.$route.params.id} ID has been ACK`,
          type: 'success',
        });
        DatamodelModule.getPredictions();
      });
  }
}
</script>
