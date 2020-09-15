<template lang="pug">
  div.app-container
    div.predictions
      h3 Predictions from all box of models
      PredictionTable(
        :predictions="predictions"
        :datamodels="datamodels"
        :tableMaxHeight="viewheight"
        @updatePredictions="getPredictions"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import PredictionTable from '@/components/PredictionTable/index.vue';
import { DatamodelModule } from '../store/modules/datamodel';

@Component({
  components: {
    PredictionTable,
  },
})
export default class Home extends Vue {
  public get predictions() {
    return DatamodelModule.predictions;
  }

  public get datamodels() {
    return DatamodelModule.datamodels;
  }

  public get viewheight() {
    return window.innerHeight;
  }

  public created() {
    DatamodelModule.getDatamodels();
    this.getPredictions();
  }

  public getPredictions() {
    DatamodelModule.getPredictions();
  }
}
</script>

<style lang="scss" scoped>
.predictions {
  text-align: center;
}
</style>
