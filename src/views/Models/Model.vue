<template lang="pug">
div
  el-row.box-row
    el-col.aligned
      h2 Anomaly Detection Model: 
        p {{ datamodel.name }}
  el-row.box-row
    el-col(:span="12")
      el-row.aligned
        h3 Model general information
      el-row
        // Blackbox general info & progress
        el-col
          // Progress
          el-row
            // Model training status
            el-col(:span="10")
              el-row.centered-row
                el-col
                  el-progress(
                    type="circle"
                    :percentage="taskStatus.current"
                    :color="progressColor"
                  )
                el-col
                  p
                    strong Status:
                    |  {{ taskStatus.status }} 
                    i(v-if="taskStatus.state === 'SUCCESS'").el-icon-success
                    i(v-else-if="taskStatus.state === 'PROGRESS'").el-icon-loading
                    i(v-else).el-icon-error

            // Last prediction status
            // TODO: prediction status
            el-col(:span="14")
              p LAST PREDICTION HERE
         
          hr

          // Info
          el-row
            el-col(:span="8")
              p
                strong Name:
                |  {{ datamodel.name }}
            el-col(:span="16")
              p
                strong ID:
                |  {{ datamodel.id }}

          el-row
            el-col(:span="5")
              p
                strong Training:
                |  {{ datamodel.is_training ? 'Yes' : 'No' }} 
                i(v-if="datamodel.is_training").el-icon-circle-check
                i(v-else).el-icon-circle-close
            el-col(:span="19")
              p
                strong Contamination train dataset:
                |  {{ datamodel.contamination * 100 }}%

          el-row
            el-col(:span="5")
              p
                strong Trained:
                |  {{ datamodel.trained ? 'Yes' : 'No' }} 
                i(v-if="datamodel.trained").el-icon-circle-check
                i(v-else).el-icon-circle-close
            el-col(:span="19")
              p
                strong Date trained:
                |  {{ datamodel.date_trained ? formatDatex(datamodel.date_trained) : 'No training date' }}

          el-row
            el-col(:span="5")
              p
                strong Deployed:
                |  {{ datamodel.deployed ? 'Yes' : 'No' }} 
                i(v-if="datamodel.deployed").el-icon-circle-check
                i(v-else).el-icon-circle-close
            el-col(:span="19")
              p
                strong Date deployed:
                |  {{ datamodel.date_deployed ? formatDatex(datamodel.date_deployed) : 'No deploying date' }}

          hr

          el-row.centered-row
            el-col(style="padding-top: 20px;")
              el-button(
                @click="deployDatamodel(datamodel)"
                :disabled="datamodel.is_training || !datamodel.trained"
              ) {{ datamodel.deployed ? 'Set unactive' : 'Set active' }}
              el-button(
                @click="trainModel(datamodel)"
                style="margin-left: 10px;"
                :disabled="datamodel.is_training"
              ) {{ datamodel.trained ? 'Retrain' : 'Train' }}
              el-popconfirm(
                title="Are you sure you want to remove this user?"
                confirmButtonText="Yes"
                cancelButtonText="No"
                confirmButtonType="danger"
                @onConfirm="deleteDatamodel(datamodel)"
              )
                el-button(
                  slot="reference"
                  type="danger"
                  style="margin-left: 10px;"
                ) Remove

    el-col(:span="12")
      el-row.aligned
        h3 Model parameters
      el-row
        el-collapse(v-model="collapseActive" accordion)
          // PCA Mahalanobis
          el-collapse-item(title="PCA Mahalanobis" name="pca_mahalanobis")
            el-row
              el-col(:span="24")
                p
                  strong n_components:
                  |  {{ datamodel.n_components }}

          // Autoencoder
          el-collapse-item(title="Autoencoder" name="autoencoder")
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

          // K-Means
          el-collapse-item(title="k-Means" name="kmeans")
            el-row
              el-col(:span="4")
                p
                  strong n_clusters:
                  |  {{ datamodel.n_clusters }}
              el-col(:span="4")
                p
                  strong Max. cluster elbow:
                  |  {{ datamodel.max_cluster_elbow }}

          // One Class SVM
          el-collapse-item(title="One Class SVM" name="ocsvm")
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

          // Gaussian Distribution
          el-collapse-item(title="Gaussian Distribution" name="gaussian_distribution")
            el-row
              el-col(:span="4")
                p
                  strong Epsilon candidates:
                  |  {{ datamodel.epsilon_candidates }}

          // Isolation Forest
          el-collapse-item(title="Isolation Forest" name="isolation_forest")
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

          // Local Outlier Factor
          el-collapse-item(title="Local Outlier Factor" name="lof")
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

          // k-Nearest Neighbors
          el-collapse-item(title="k-Nearest Neighbors" name="knn")
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
  el-row.box-row
    el-col.aligned
      h3 Predictions
      el-table
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
  public datamodel: { [key: string]: any } = {};

  public predictions: { [key: string]: any }[] = [];

  public taskStatus: { [key: string]: string | number } = {};

  public interval?: NodeJS.Timeout;

  public collapseActive: string[] = [];

  public activated() {
    this.getDatamodel();
    this.getPredictions();
    this.getTaskStatus();
    if (this.datamodel.task_status) {
      this.interval = setInterval(() => {
        if (
          Object.keys(this.taskStatus).length === 0 ||
          this.taskStatus.state !== 'SUCCESS'
        ) {
          this.getTaskStatus();
        } else if (this.taskStatus.state === 'SUCCESS') {
          this.$set(this.datamodel, 'is_training', false);
          this.$set(this.datamodel, 'trained', true);
        }
      }, 5000);
    }
  }

  public deactivated() {
    if (this.interval) {
      clearInterval(this.interval);
    }
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

  public getPredictions() {
    backendService
      .getPredictionsFromDatamodel(
        AuthModule.accessToken,
        this.$route.params.id
      )
      .then((res) => {
        const { data } = res as AxiosResponse;
        this.predictions = data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public getTaskStatus() {
    backendService
      .getTaskStatus(this.$route.params.id, AuthModule.accessToken)
      .then((res) => {
        const { data } = res as AxiosResponse;
        this.taskStatus = data;
      })
      .catch((err) => {
        console.log(`An error has ocurred when getting task status: ${err}`);
      });
  }

  public formatDatex(date: string): string {
    return formatDate(date, 'YYYY-MM-D HH:mm:ss');
  }

  public progressColor(percentage: number) {
    if (percentage === 100) {
      return '#f64c72';
    }

    return '#242582';
  }

  public deployDatamodel(datamodel: any) {
    backendService
      .deployDatamodel(datamodel.id, AuthModule.accessToken)
      .then(() => this.getDatamodel())
      .catch((err) => console.log(err));
  }

  public deleteDatamodel(datamodel: any) {
    backendService
      .deleteDatamodel(datamodel.id, AuthModule.accessToken)
      .then(() => {
        this.$router.push('/models/index');
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
}
</script>

<style lang="scss" scoped>
h2 {
  p {
    display: inline-block;
    font-weight: normal;
  }
}

hr {
  margin: 0 10px 0 10px;
}

.box-row {
  margin: 20px 20px 10px 20px;
  & > .el-col {
    padding: 20px;
    box-shadow: 0px 0px 20px 0px rgba(0, 21, 41, 0.2);

    &:first-child {
      margin-right: 12.5px;
      width: calc(50% - 12.5px);
    }

    &:last-child {
      margin-left: 12.5px;
      width: calc(50% - 12.5px);
    }

    &:only-child {
      margin-left: 0;
      margin-right: 0;
      width: 100%;
    }
  }
}

.box-row:first-child {
  margin: 20px 20px 10px 20px;
}

.aligned {
  text-align: center;
}

.model-box {
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid gray;
}

.centered-row {
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
