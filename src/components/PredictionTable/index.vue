<template lang="pug">
div
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
      width="220"
      :sortable="true"
    )
      template(slot-scope="scope")
        p {{ scope.row.created_on | formatDate }}
    el-table-column(
      prop="predictions_received_on"
      label="Predictions received on"
      width="220"
      :sortable="true"
    )
      template(slot-scope="scope")
        p(v-if="scope.row.predictions_received_on")
          | {{ scope.row.predictions_received_on | formatDate }}
        p(v-else) Prediction not received yet
    el-table-column(
      prop="data"
      label="Data"
    )
      template(slot-scope="scope")
        pre {{ scope.row.data.data[0] | prettify }}
    el-table-column(
      prop="predictions"
      label="Predictions"
    )
      template(slot-scope="scope")
        pre {{ scope.row.predictions | prettify }}
    el-table-column(
      prop="user_ack"
      label="User ACK"
      width="200"
      sortable
    )
      template(slot-scope="scope")
        p {{ scope.row.user_ack || 'No ACK' }}
  div.table-buttons
    el-popconfirm(
      :title="`Are you sure you want to ACK the ${this.selectedPredictions.length} selected predictions?`"
      confirmButtonText="Yes"
      cancelButtonText="No"
      confirmButtonType="success"
      @onConfirm="ackSelectedPredictions"
    )
      el-button(
        slot="reference"
        :disabled="this.selectedPredictions.length <= 0"
      ) ACK
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
    if (column.property !== 'selection') {
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