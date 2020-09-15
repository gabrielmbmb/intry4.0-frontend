<template lang="pug">
  div.app-container
    h2 New model
    el-form(
      inline
      label-position="top"
      ref="datamodelForm"
      :model="datamodel"
      :rules="formRules"
      size="small"
    )
      el-row
        el-form-item(label="Box of models name" prop="name")
          el-input(
            v-model="datamodel.name"
            placeholder="Blackbox name..."
          )

        el-form-item(label="Contamination" prop="contamination")
          el-tooltip(content="The percentage of outliers in the dataset")
            el-input-number(
              v-model="datamodel.contamination"
              :min="0"
              :max="0.5"
              :step="0.1"
            )

        el-form-item(label="Scaler" prop="scaler")
          el-select(
              v-model="datamodel.scaler"
              placeholder="Scaler..."
          )
            el-option(
              v-for="scaler in SCALERS"
              :key="scaler"
              :value="scaler"
              :label="scaler"
            )

      // Select attributes of the model
      el-row
        el-form-item(label="Attributes" prop="attributes").full-width-item
          el-select(
            v-model="attributes"
            multiple
            filterable
            placeholder="Select attributes..."
          )
            el-option(
              v-for="attribute in attrsPlc"
              :key="attribute"
              :label="attribute.split('#')[0]"
              :value="attribute"
            )

      // Models
      el-form-item(label="Models" prop="models")
        el-checkbox-group(
          v-model="selectedModels"
          :required="true"
        )
          el-checkbox(
            v-for="[key, value] in Object.entries(AVAILABLE_MODELS)"
            v-model="datamodel[key]"
            :label="key"
            :key="key"
          ) {{ value }}

      // Models parameters
      el-collapse(
        v-model="collapsedModels"
        accordion
      )

        // PCA Mahalanobis
        el-collapse-item(
          v-if="selectedModels.includes('pca_mahalanobis')"
          name="pca_mahalanobis"
          title="PCA Mahalanobis"
        )
          el-form-item(label="n_components" prop="n_components")
            el-tooltip(content="Note: the number of components has to be lower than the number of attributes")
              el-input-number(
                v-model="datamodel.n_components"
                :min="1"
                :max="attributes.length - 1"
              )

        // Autoencoder
        el-collapse-item(
          v-if="selectedModels.includes('autoencoder')"
          name="autoencoder"
          title="Autoencoder"
        )
          el-form-item(
            label="Layers"
            prop="hidden_neurons"
            style="width: 100%;"
          )
              el-input-number(
                  v-model="layerNumNeurons"
                  :min="1"
                  :max="maxNeurons"
                  style="width: 200px;"
              )
              el-button(
                  :disabled="middleLayerAdded"
                  size="mini"
                  style="margin-left: 10px;"
                  @click="onClickAddLayer"
              ) Add layer
              el-button(
                  :disabled="hiddenNeurons.length === 0"
                  size="mini"
                  style="margin-left: 10px;"
                  @click="onClickRemoveLayer"
              ) Remove last layer
              el-switch(
                  v-model="middleLayer"
                  active-text="Middle layer"
                  style="margin-left: 10px;"
              )
              p {{ hiddenNeurons }}
          el-form-item(label="dropout_rate" prop="dropout_rate")
              el-input-number(
                  v-model="datamodel.dropout_rate"
                  :min="0.2"
                  :max="0.8"
                  :step="0.1"
                  style="width: 200px;"
              )

          el-form-item(label="activation" prop="activation")
              el-select(
                  v-model="datamodel.activation"
                  placeholder="Activation function..."
              )
                  el-option(
                      v-for="activation in ACTIVATION"
                      :key="activation"
                      :label="activation"
                      :value="activation"
                  )

          el-form-item(label="kernel_initializer" prop="kernel_initializer")
              el-select(
                  v-model="datamodel.kernel_initializer"
                  placeholder="Activation function..."
                  style="width: 200px;"
              )
                  el-option(
                      v-for="kernel_initializer in KERNEL_INITIALIZER"
                      :key="kernel_initializer"
                      :label="kernel_initializer"
                      :value="kernel_initializer"
                  )

          el-form-item(label="loss_function" prop="loss_function")
              el-select(
                  v-model="datamodel.loss_function"
                  placeholder="Activation function..."
                  style="width: 200px;"
              )
                  el-option(
                      v-for="loss_function in LOSS_FUNCTION"
                      :key="loss_function"
                      :label="loss_function"
                      :value="loss_function"
                  )

          el-form-item(label="optimizer" prop="optimizer")
              el-select(
                  v-model="datamodel.optimizer"
                  placeholder="Activation function..."
                  style="width: 200px;"
              )
                  el-option(
                      v-for="optimizer in OPTIMIZER"
                      :key="optimizer"
                      :label="optimizer"
                      :value="optimizer"
                  )

          el-form-item(label="epochs" prop="epochs")
              el-input-number(
                  v-model="datamodel.epochs"
                  style="width: 200px;"
              )

          el-form-item(label="batch_size" prop="batch_size")
              el-input-number(
                  v-model="datamodel.batch_size"
                  style="width: 200px;"
              )

          el-form-item(label="validation_split" prop="validation_split")
              el-input-number(
                  v-model="datamodel.validation_split"
                  :min="0.01"
                  :step="0.01"
                  style="width: 200px;"
              )

          el-form-item(
            label="early_stopping"
            prop="early_stopping"
          )
              el-switch(
                  v-model="datamodel.early_stopping"
                  active-text="Yes"
                  inactive-text="No"
              )
        // k-Means
        el-collapse-item(
          v-if="selectedModels.includes('kmeans')"
          name="kmeans"
          title="k-Means"
        )
          el-form-item(label="n_clusters" prop="n_clusters")
              el-input-number(
                  v-model="datamodel.n_clusters"
              )

          el-form-item(label="max_cluster_elbow" prop="max_cluster_elbow")
              el-input-number(
                  v-model="datamodel.max_cluster_elbow"
              )

        // One Class SVM
        el-collapse-item(
          v-if="selectedModels.includes('ocsvm')"
          name="ocsvm"
          title="One Class SVM"
        )
          el-form-item(label="kernel" prop="kernel")
              el-select(
                  v-model="datamodel.kernel"
                  placeholder="Kernel function..."
              )
                  el-option(
                      v-for="kernel in KERNEL"
                      :key="kernel"
                      :label="kernel"
                      :value="kernel"
                  )

          el-form-item(label="degree" prop="degree")
              el-input-number(
                  v-model="datamodel.degree"
                  :min="1"
              )

          el-form-item(label="gamma" prop="gamma")
              el-select(
                  v-model="datamodel.gamma"
                  placeholder="Kernel coefficient..."
              )
                  el-option(
                      v-for="gamma in GAMMA"
                      :key="gamma"
                      :label="gamma"
                      :value="gamma"
                  )

          el-form-item(label="coef0" prop="coef0")
              el-input-number(
                  v-model="datamodel.coef0"
                  :min="0"
                  :step="0.1"
              )

          el-form-item(label="tol" prop="tol")
              el-input-number(
                  v-model="datamodel.tol"
                  :min="0"
                  :step="0.001"
              )

          el-form-item(label="shrinking" prop="shrinking")
              el-switch(
                  v-model="datamodel.shrinking"
                  active-text="Yes"
                  inactive-text="No"
              )

          el-form-item(label="cache_size" prop="cache_size")
              el-input-number(
                  v-model="datamodel.cache_size"
                  :min="1"
              )


        // Gaussian Distribution
        el-collapse-item(
          v-if="selectedModels.includes('gaussian_distribution')"
          name="gaussian_distribution"
          title="Gaussian Distribution"
        )
          el-form-item(label="epsilon_candidates" prop="epsilon_candidates")
              el-input-number(
                  v-model="datamodel.epsilon_candidates"
                  :min="1"
              )

        // Isolation Forest
        el-collapse-item(
          v-if="selectedModels.includes('isolation_forest')"
          name="isolation_forest"
          title="Isolation Forest"
        )
          el-form-item(label="n_estimators" prop="n_estimators")
              el-input-number(
                  v-model="datamodel.n_estimators"
                  :min="1"
                  style="width: 200px;"
              )

          el-form-item(label="max_features" prop="max_features")
              el-input-number(
                  v-model="datamodel.max_features"
                  :min="1.0"
                  :step="0.1"
                  style="width: 200px;"
              )

          el-form-item(label="bootstrap" prop="bootstrap")
              el-switch(
                  v-model="datamodel.bootstrap"
                  active-text="Yes"
                  inactive-text="No"
              )

        // Local Outlier Factor
        el-collapse-item(
          v-if="selectedModels.includes('lof')"
          name="lof"
          title="Local Outlier Factor"
        )
          el-form-item(label="n_neighbors" prop="n_neighbors_lof")
              el-input-number(
                  v-model="datamodel.n_neighbors_lof"
                  :min="2"
              )

          el-form-item(label="algorithm" prop="algorithm_lof")
              el-select(
                  v-model="datamodel.algorithm_lof"
                  placeholder="Algorithm..."
              )
                  el-option(
                      v-for="algorithm_lof in ALGORITHM"
                      :key="algorithm_lof"
                      :label="algorithm_lof"
                      :value="algorithm_lof"
                  )

          el-form-item(label="leaf_size" prop="leaf_size_lof")
              el-input-number(
                  v-model="datamodel.leaf_size_lof"
                  :min="1"
              )

          el-form-item(label="metric" prop="metric_lof")
              el-select(
                  v-model="datamodel.metric_lof"
                  placeholder="Algorithm..."
              )
                  el-option(
                      v-for="metric in METRIC"
                      :key="metric"
                      :label="metric"
                      :value="metric"
                  )

          el-form-item(label="p" prop="p_lof")
              el-input-number(
                  v-model="datamodel.p_lof"
                  :min="1"
              )

        // k-Nearest Neighbors
        el-collapse-item(
          v-if="selectedModels.includes('knn')"
          name="knn"
          title="k-Nearest Neighbors"
        )
          el-form-item(label="n_neighbors" prop="n_neighbors_knn")
              el-input-number(
                  v-model="datamodel.n_neighbors_knn"
                  :min="2"
              )

          el-form-item(label="algorithm" prop="algorithm_knn")
              el-select(
                  v-model="datamodel.algorithm_knn"
                  placeholder="Algorithm..."
              )
                  el-option(
                      v-for="algorithm_knn in ALGORITHM"
                      :key="algorithm_knn"
                      :label="algorithm_knn"
                      :value="algorithm_knn"
                  )

          el-form-item(label="radius" prop="radius")
              el-input-number(
                  v-model="datamodel.radius"
                  :step="0.1"
              )

          el-form-item(label="leaf_size" prop="leaf_size_knn")
              el-input-number(
                  v-model="datamodel.leaf_size_knn"
                  :min="1"
              )

          el-form-item(label="metric" prop="metric_knn")
              el-select(
                  v-model="datamodel.metric_knn"
                  placeholder="Algorithm..."
              )
                  el-option(
                      v-for="metric in METRIC"
                      :key="metric"
                      :label="metric"
                      :value="metric"
                  )

          el-form-item(label="p" prop="p_knn")
              el-input-number(
                  v-model="datamodel.p_knn"
                  :min="1"
              )

          el-form-item(label="score_func" prop="score_func")
              el-select(
                  v-model="datamodel.score_func"
                  placeholder="Score..."
              )
                  el-option(
                      v-for="score_knn in SCORE_KNN"
                      :key="score_knn"
                      :label="score_knn"
                      :value="score_knn"
                  )
      el-form-item
        el-button(
          :loading="datamodelIsBeingCreated"
          @click="createDatamodel"
        ).create-button Create box of models

</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Ref } from 'vue-property-decorator';
import backendService from '@/api/backend.service';
import { NewDatamodel } from '@/types/datamodel';
import EventBus from '@/utils/eventBus';
import { AxiosResponse } from 'axios';
import { Form } from 'element-ui';
import { AuthModule } from '../../store/modules/auth';

@Component
export default class NewModel extends Vue {
  @Ref('datamodelForm') readonly datamodelForm!: Form;

  public AVAILABLE_MODELS = {
    pca_mahalanobis: 'PCA Mahalanobis',
    autoencoder: 'Autoencoder',
    kmeans: 'k-Means',
    ocsvm: 'One Class SVM',
    gaussian_distribution: 'Gaussian Distribution',
    isolation_forest: 'Isolation Forest',
    lof: 'Local Outlier Factor',
    knn: 'k-Nearest Neighbors',
  };

  public ACTIVATION = [
    'elu',
    'softmax',
    'selu',
    'softplus',
    'softsign',
    'relu',
    'tanh',
    'sigmoid',
    'hard_sigmoid',
    'exponential',
  ];

  public KERNEL_INITIALIZER = [
    'Zeros',
    'Ones',
    'Constant',
    'RandomNormal',
    'RandomUniform',
    'TruncatedNormal',
    'VarianceScaling',
    'Orthogonal',
    'Identity',
    'lecun_uniform',
    'glorot_normal',
    'glorot_uniform',
    'he_normal',
    'lecun_normal',
    'he_uniform',
  ];

  public LOSS_FUNCTION = [
    'binary_crossentropy',
    'categorical_crossentropy',
    'categorical_hinge',
    'cosine_similarity',
    'deserialize',
    'get',
    'hinge',
    'kld',
    'kullback_leibler_divergence',
    'logcosh',
    'mae',
    'mape',
    'mse',
    'msle',
    'poisson',
    'serialize',
    'sparse_categorical_crossentropy',
    'squared_hinge',
  ];

  public OPTIMIZER = [
    'sgd',
    'rmsprop',
    'adagrad',
    'adadelta',
    'adam',
    'adamax',
    'nadam',
  ];

  public KERNEL = ['linear', 'poly', 'rbf', 'sigmoid', 'precomputed'];

  public GAMMA = ['scale', 'auto', 'float'];

  public ALGORITHM = ['auto', 'ball_tree', 'kd_tree', 'brute'];

  public METRIC = [
    'cityblock',
    'cosine',
    'euclidean',
    'l1',
    'l2',
    'manhattan',
    'braycurtis',
    'canberra',
    'chebyshev',
    'correlation',
    'dice',
    'hamming',
    'jaccard',
    'kulsinski',
    'mahalanobis',
    'minkowski',
    'rogerstanimoto',
    'russellrao',
    'seuclidean',
    'sokalmichener',
    'sokalsneath',
    'sqeuclidean',
    'yule',
  ];

  public SCORE_KNN = ['max_distance', 'average', 'median'];

  public SCALERS = ['minmax', 'standard'];

  public datamodel: NewDatamodel = {
    name: '',
    plcs: {},
    contamination: 0,
    scaler: 'minmax',
    // PCA Mahalanobis
    n_components: 2,
    // Autoencoder
    dropout_rate: 0.2,
    activation: 'elu',
    kernel_initializer: 'glorot_uniform',
    loss_function: 'mse',
    optimizer: 'adam',
    epochs: 100,
    batch_size: 10,
    validation_split: 0.05,
    early_stopping: true,
    // k-Means
    n_clusters: 5,
    max_cluster_elbow: 100,
    // One Class SVM
    kernel: 'rbf',
    degree: 3,
    gamma: 'scale',
    coef0: 0.0,
    tol: 0.001,
    shrinking: true,
    cache_size: 200,
    // Gaussian Distribution
    epsilon_candidates: 100000000,
    // Isolation Forest
    n_estimators: 100,
    max_features: 1.0,
    bootstrap: false,
    // Local Outlier Factor
    n_neighbors_lof: 20,
    algorithm_lof: 'auto',
    leaf_size_lof: 30,
    metric_lof: 'minkowski',
    p_lof: 2,
    // k-Nearest Neighbors
    n_neighbors_knn: 5,
    radius: 1.0,
    algorithm_knn: 'auto',
    leaf_size_knn: 30,
    metric_knn: 'minkowski',
    p_knn: 2,
    score_func: 'max_distance',
  };

  public attributes = [];

  public attrsPlc = [];

  public selectedModels: string[] = [];

  public collapsedModels = [];

  public datamodelIsBeingCreated = false;

  // Autoencoder
  public hiddenNeurons: number[] = [];

  public layerNumNeurons = 0;

  public maxNeurons = 9999;

  public middleLayer = false;

  public middleLayerAdded = false;

  public formRules = {
    name: [
      {
        required: true,
        trigger: 'blur',
        message: 'Please, write a name for this datamodel',
      },
    ],
    attributes: [
      {
        validator: this.attributesValidator,
        trigger: 'change',
        required: true,
      },
    ],
    models: [
      {
        validator: this.modelsValidator,
        trigger: 'change',
        required: true,
      },
    ],
    hidden_neurons: [
      {
        validator: this.hiddenNeuronsValidator,
        trigger: 'change',
        required: true,
      },
    ],
  };

  public attributesValidator(rule: any, value: any, callback: any) {
    if (this.attributes.length <= 0) {
      callback(new Error('Please, select at least one attribute'));
    }
    callback();
  }

  public modelsValidator(rule: any, value: any, callback: any) {
    if (this.selectedModels.length <= 0) {
      callback(new Error('Please, select at least one model'));
    }
    callback();
  }

  public hiddenNeuronsValidator(rule: any, value: any, callback: any) {
    if (this.attributes.length < Math.min(...this.hiddenNeurons)) {
      callback(
        new Error(
          'The number of neurons should not exceed the number of devices!'
        )
      );
    }
    callback();
  }

  public created() {
    this.getEntities();
  }

  public deactivated() {
    this.resetForm();
  }

  public getEntities() {
    backendService
      .getEntities(AuthModule.accessToken)
      .then((res) => {
        const { data } = res as AxiosResponse;
        this.attrsPlc = data.reduce(
          (attrs: [], plc: { [key: string]: any }) => {
            const attrsWithPlc = plc.attributes.map(
              (attr: string) => `${attr}#${plc.id}`
            );
            return [...attrs, ...attrsWithPlc];
          },
          []
        );
      })
      .catch((err) => {
        console.log(`An error has ocurred when fetching entities: ${err}`);
      });
  }

  public onClickAddLayer() {
    this.addAutoencoderLayer();
  }

  public onClickRemoveLayer() {
    this.removeAutoencoderLayer();
  }

  public addAutoencoderLayer() {
    if (this.hiddenNeurons) {
      const hiddenNeuronsLen = this.hiddenNeurons.length;

      if (hiddenNeuronsLen !== 0) {
        const positionToInsert = hiddenNeuronsLen / 2;
        this.hiddenNeurons.splice(positionToInsert, 0, this.layerNumNeurons);
        this.maxNeurons = this.layerNumNeurons;

        if (!this.middleLayer) {
          this.hiddenNeurons.splice(
            positionToInsert + 1,
            0,
            this.layerNumNeurons
          );
        } else {
          this.middleLayerAdded = true;
        }
      } else {
        this.hiddenNeurons.push(this.layerNumNeurons, this.layerNumNeurons);
        this.maxNeurons = this.layerNumNeurons;
      }
    }
  }

  public removeAutoencoderLayer() {
    if (this.hiddenNeurons) {
      const hiddenNeuronsLen = this.hiddenNeurons.length;

      if (this.middleLayerAdded) {
        this.hiddenNeurons.splice(Math.floor(hiddenNeuronsLen / 2), 1);
        this.middleLayerAdded = false;
        this.maxNeurons = this.hiddenNeurons[
          Math.floor(hiddenNeuronsLen / 2) - 2
        ];
      } else {
        this.hiddenNeurons.splice(Math.floor(hiddenNeuronsLen / 2) - 1, 2);

        if (this.hiddenNeurons.length === 0) {
          this.maxNeurons = this.attributes.length;
        } else {
          this.maxNeurons = this.hiddenNeurons[
            Math.floor(hiddenNeuronsLen / 2) - 2
          ];
        }
      }
    }
  }

  public resetForm() {
    this.datamodelForm.resetFields();
    this.selectedModels = [];
    this.attributes = [];
  }

  public createDatamodel() {
    this.datamodelForm.validate((valid: boolean) => {
      if (valid) {
        this.datamodelIsBeingCreated = true;
        this.selectedModels.forEach((model: string) => {
          this.datamodel[model] = true;
        });
        this.attributes.forEach((attrWithPlc: string) => {
          const [attribute, plc] = attrWithPlc.split('#');
          if (this.datamodel.plcs[plc]) {
            this.datamodel.plcs[plc] = [...this.datamodel.plcs[plc], attribute];
          } else {
            this.datamodel.plcs[plc] = [attribute];
          }
        });
        this.datamodel.hidden_neurons = this.hiddenNeurons.join(',');

        // Call the API to create the datamodel
        backendService
          .createDatamodel(this.datamodel, AuthModule.accessToken)
          .then(() => {
            this.datamodelIsBeingCreated = false;
            this.$notify({
              title: 'Datamodel has been created',
              message: `The datamodel with name ${this.datamodel.name} has been created!`,
              type: 'success',
            });
            EventBus.$emit('update-models');
            this.resetForm();
            this.$router.push('/models/index');
          })
          .catch((err) => {
            this.datamodelIsBeingCreated = false;
            console.log(err);
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.full-width-item {
  width: 100%;
  .el-select {
    width: 100%;
  }
}

.create-button {
  margin-top: 30px;
}
</style>
