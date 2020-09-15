<template lang="pug">
div
  el-row.box-row
    el-col.aligned
      h2 Prediction of {{ datamodel.name }} box of models
  el-row.box-row
    el-col(:span="12")
      el-row.aligned
        el-divider
          h3 Prediction general info
      el-row
        p  
          strong ID:
          |  {{  prediction.id }}
        p
          strong Box of models:
            router-link(:to="`/models/${datamodel.id}/detail`")  {{ datamodel.name }}
        p
          strong Prediction request created on:
          |  {{  prediction.created_on | dateFormatting }}
        p
          strong Values used in the prediction:
          ul
            li(
              v-for="column in prediction.data['columns']",
              key="column"
            )
              strong {{ column }}:
              ul
                li Value: {{ prediction.data['data'][0][prediction.data['columns'].indexOf(column)] }}
                li Received at: {{ prediction.dates[column] | dateFormatting }}
        p(v-if="prediction.user_ack")
          strong Acknowledge by user:
          |  {{ prediction.user_ack }}

    el-col(:span="12")
      el-row.aligned
        el-divider
          h3 Predictions 
      el-row
        strong Predictions received on:
        |  {{ prediction.predictions_received_on | dateFormatting }}
      el-row
        el-divider
          h3 Results
        ul(v-if="Object.keys(prediction.predictions).length > 0")
          li(
            v-for="model in Object.keys(prediction.predictions)"
            :key="model"
          )
            strong {{ MODEL_NAME[model] }}:
            |  {{ prediction.predictions[model] ? 'anomaly': 'not anomaly' }} 
            i(:class="prediction.predictions[model] ? 'el-icon-error' : 'el-icon-success'")
      el-row
        el-divider
          h3 Actions
      el-row.aligned
        el-popconfirm(
          :title="`Are you sure you want to acknowledge this prediction?`"
          confirmButtonText="Yes"
          cancelButtonText="No"
          confirmButtonType="success"
          @onConfirm="ackPrediction"
        )
          el-button(
            type="primary"
            slot="reference"
          ) Acknowledge prediction
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
  public MODEL_NAME: { [key: string]: string } = {
    pca_mahalanobis: 'PCA + Mahalanobis',
    autoencoder: 'Autoencoder',
    kmeans: 'K-Means',
    one_class_svm: 'One Class SVM',
    isolation_forest: 'Isolation Forest',
    knearest_neighbors: 'k-Nearest Neighbors',
    gaussian_distribution: 'Gaussian Distribution',
    local_outlier_factor: 'Local Outlier Factor',
  };

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

<style lang="scss" scoped>
.aligned {
  text-align: center;
}

.el-icon-success,
.el-icon-circle-check {
  color: green;
}

.el-icon-error,
.el-icon-circle-close {
  color: red;
}
</style>
