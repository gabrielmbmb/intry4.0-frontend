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
      strong Data:
        pre {{ prediction.data | prettify }}
    li
      strong Dates:
        pre {{ prediction.dates | prettify }}
    li
      strong Predictions received on:
      |  {{ prediction.predictions_received_on | dateFormatting }}
    li
      strong Predictions:
        pre(v-if="prediction.predictions") {{ prediction.predictions | prettify }}
        p(v-else) Not received yet
    li
      strong User ACK:
      |  {{ prediction.ack_user || 'no ACK' }}
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
