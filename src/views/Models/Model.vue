<template lang="pug">
div
  el-row
    h1 {{ `Anomaly Detection Model: ${datamodel.name}` }}

  div.model-box
    el-row
      el-col(:span="6")
        p
          strong ID:
          |  {{ datamodel.id }}
      el-col(:span="6")
        p
          strong Name:
          |  {{ datamodel.name }}
      el-col(:span="6")
        p
          strong Is Training:
          |  {{ datamodel.is_training ? 'Yes' : 'No' }}
      el-col(:span="6")
        p
          strong Contamination train dataset:
          |  {{ datamodel.contamination * 100 }}%

    el-row
        el-col(:span="6")
          p
            strong Trained:
            |  {{ datamodel.trained ? 'Yes' : 'No' }}
        el-col(:span="6")
          p
            strong Date trained:
            |  {{ datamodel.date_trained ? formatDatex(datamodel.date_trained) : 'No training date' }}
        el-col(:span="6")
          p
            strong Deployed:
            |  {{ datamodel.deployed ? 'Yes' : 'No' }}
        el-col(:span="6")
          p
            strong Date deployed:
            |  {{ datamodel.date_deployed ? formatDatex(datamodel.date_deployed) : 'No deploying date' }}
  div(v-if="datamodel.pca_mahalanobis").model-box 
    el-row
      h3 PCA Mahalanobis parameters
    el-row
      el-col(:span="24")
        p
          strong n_components:
          |  {{ datamodel.n_components }}

  div(v-if="datamodel.autoencoder").model-box
    el-row
      h3 Autoencoder parameters
    el-row
      el-col(:span="4")
        p
          strong Layers:
          |  {{ datamodel.hidden_neurons }}
      el-col(:span="4")
        p
          strong Dropout rate:
          |  {{ datamodel.dropout_rate }}
      el-col(:span="4")
        p
          strong Activation:
          |  {{ datamodel.activation }}
      el-col(:span="4")
        p
          strong Kernel initializer:
          |  {{ datamodel.kernel_initializer }}
      el-col(:span="4")
        p
          strong Loss function:
          |  {{ datamodel.loss_function }}
      el-col(:span="4")
        p
          strong Optimizer:
          |  {{ datamodel.optimizer }}
    el-row
      el-col(:span="4")
        p
          strong Epochs:
          |  {{ datamodel.epochs }}
      el-col(:span="4")
        p
          strong Batch size:
          |  {{ datamodel.batch_size }}
      el-col(:span="4")
        p
          strong Validation split:
          |  {{ datamodel.validation_split }}
      el-col(:span="4")
        p
          strong Early stopping:
          |  {{ datamodel.early_stopping }}

  div(v-if="datamodel.kmeans").model-box
    el-row
      h3 K-Means parameters
    el-row
      el-col(:span="4")
        p
          strong n_clusters:
          |  {{ datamodel.n_clusters }}
      el-col(:span="4")
        p
          strong Max. cluster elbow:
          |  {{ datamodel.max_cluster_elbow }}

  div(v-if="datamodel.ocsvm").model-box
    el-row
      h3 One Class SVM
    el-row
      el-col(:span="4")
        p
          strong Kernel:
          |  {{ datamodel.kernel }}
      el-col(:span="4")
        p
          strong Degree:
          |  {{ datamodel.degree }}
      el-col(:span="4")
        p
          strong Gamma:
          |  {{ datamodel.gamma }}
      el-col(:span="4")
        p
          strong Coef0:
          |  {{ datamodel.coef0 }}
      el-col(:span="4")
        p
          strong tol:
          |  {{ datamodel.tol }}
      el-col(:span="4")
        p
          strong shrinking:
          |  {{ datamodel.shrinking }}
    el-row
      el-col(:span="4")
        p
          strong cache_size:
          |  {{ datamodel.cache_size }}

  div(v-if="datamodel.gaussian_distribution").model-box
    el-row
      h3 Gaussian Distribution
    el-row
      el-col(:span="4")
        p
          strong Epsilon candidates:
          |  {{ datamodel.epsilon_candidates }}

  div(v-if="datamodel.isolation_forest").model-box
    el-row
      h3 Isolation Forest
    el-row
      el-col(:span="4")
        p
          strong n_estimators:
          |  {{ datamodel.n_estimators }}
      el-col(:span="4")
        p
          strong max_features:
          |  {{ datamodel.max_features }}
      el-col(:span="4")
        p
          strong bootstrap:
          |  {{ datamodel.bootstrap }}

  div(v-if="datamodel.lof").model-box
    el-row
      h3 Local Outlier Factor
    el-row
      el-col(:span="4")
        p
          strong n_neighbors:
          |  {{ datamodel.n_neighbors_lof }}
      el-col(:span="4")
        p
          strong algorithm:
          |  {{ datamodel.algorithm_lof }}
      el-col(:span="4")
        p
          strong leaf_size:
          |  {{ datamodel.leaf_size_lof }}
      el-col(:span="4")
        p
          strong metric:
          |  {{ datamodel.metric_lof }}
      el-col(:span="4")
        p
          strong p:
          |  {{ datamodel.p_lof }}

  div(v-if="datamodel.knn").model-box
    el-row
      h3 K-Nearest Neighbors
    el-row
      el-col(:span="4")
        p
          strong n_neighbors:
          |  {{ datamodel.n_neighbors_knn }}
      el-col(:span="4")
        p
          strong n_neighbors:
          |  {{ datamodel.radius }}
      el-col(:span="4")
        p
          strong algorithm:
          |  {{ datamodel.algorithm_knn }}
      el-col(:span="4")
        p
          strong leaf_size:
          |  {{ datamodel.leaf_size_knn }}
      el-col(:span="4")
        p
          strong metric:
          |  {{ datamodel.metric_knn }}
      el-col(:span="4")
        p
          strong p:
          |  {{ datamodel.p_knn }}
    el-row
      el-col(:span="4")
        p
          strong p:
          |  {{ datamodel.score_func }}
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import backendService from '@/api/backend.service';
import { AxiosResponse } from 'axios';
import formatDate from '@/utils/date';
import { AuthModule } from '../../store/modules/auth';

@Component
export default class Model extends Vue {
  public datamodel = {};

  public mounted() {
    this.getDatamodel();
  }

  public getDatamodel() {
    backendService
      .getDatamodel(this.$route.params.id, AuthModule.accessToken)
      .then((res) => {
        const { data } = res as AxiosResponse;
        this.datamodel = data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public formatDatex(date: string): string {
    return formatDate(date, 'YYYY-MM-D HH:mm:ss');
  }
}
</script>

<style lang="scss" scoped>
.model-box {
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid gray;
}
</style>
