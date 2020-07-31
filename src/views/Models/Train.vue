<template lang="pug">
div.app-container.new-user-form
  h2 Train model: {{ datamodel.name }}
  p Train with data from:
  el-radio(v-model="trainSource" label="db") Database
  el-radio(v-model="trainSource" label="csv") CSV

  // Train with data from database
  div(v-if="trainSource === 'db'").train-option
    el-select(
      v-model="dbDataRows"
      placeholder="Method to obtaing the rows..."
    )
      el-option(
        v-for="(value, key) in DATABASE_ROWS_METHODS"
        :key="key"
        :label="value"
        :value="key"
      )
    div(v-if="dbDataRows ==='nrows'").train-option
      p Number of first N-rows to take to train:
      el-form
        el-form-item Number of rows:
          el-input(
            v-model="trainNRows"
            style="width: 200px; margin-left: 10px;"
          )
        el-form-item
          el-button(
            @click="submit(trainNRows)"
            :loading="isLoading"
            :disabled="trainNRows < 1000"
          ) Train
    div(v-else-if="dbDataRows === 'dates'").train-option
      el-form(label-position="top")
        el-form-item(label="Rows between dates:")
          el-date-picker(
            v-model="dates"
            type="datetimerange"
            range-separator="To"
            start-placeholder="From date..."
            end-placeholder="To date..."
          )
          el-form-item
            el-button(
              @click="submit(undefined, dates[0], dates[1])"
              :disabled="dates.length < 2"
              style="margin-top: 10px;"
            ) Train
  // Train with data from CSV file
  div(v-else)
    el-form
      el-form-item Column index:
        el-input(
          v-model="csvColumnIndex"
          style="width: 200px; margin-left: 10px;"
        )
      el-form-item CSV File:
        input(
          type="file"
          id="file"
          ref="file"
          @change="handleFileUpload"
        )
      el-form-item
        el-button(
          @click="submitFile"
          :disabled="!fileUploaded"
          :loading="isLoading"
        ) Train


</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import backendService from '@/api/backend.service';
import EventBus from '@/utils/eventBus';
import { AxiosResponse } from 'axios';
import formatDate from '@/utils/date';
import { AuthModule } from '../../store/modules/auth';

@Component
export default class TrainModel extends Vue {
  public DATABASE_ROWS_METHODS = {
    nrows: 'Take the first N-rows',
    dates: 'Take the rows between two dates',
  };

  public datamodel = {
    id: '',
    name: '',
  };

  public trainSource = 'db';

  public csvColumnIndex = '';

  public file?: File;

  public fileUploaded = false;

  public trainNRows = 1000;

  public isLoading = false;

  public dbDataRows = '';

  public dates: Date[] = [];

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

  public handleFileUpload() {
    /* eslint-disable-next-line */
    if ((this.$refs.file as HTMLInputElement).files![0].type === 'text/csv') {
      this.fileUploaded = true;
      this.file = (this.$refs.file as HTMLInputElement).files![0]; // eslint-disable-line
    }
  }

  public notify(source: string) {
    this.$notify({
      title: `Train with ${source} started`,
      message: `The training process started for model ${this.datamodel.name} has started`,
      type: 'success',
    });
    EventBus.$emit('update-models');
    this.$router.push('/models/index');
  }

  public submit(n?: number, fromDate?: Date, toDate?: Date) {
    let payload = {};

    if (n) {
      payload = { n };
    } else if (fromDate && toDate) {
      const format = 'YYYY-MM-D HH:mm:ss';
      payload = {
        from_date: formatDate(fromDate, format),
        to_date: formatDate(toDate, format),
      };
    }

    if (Object.keys(payload).length > 0) {
      this.isLoading = true;
      backendService
        .trainDatamodel(this.datamodel.id, payload, AuthModule.accessToken)
        .then(() => {
          this.notify('historic database data');
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    }
  }

  public submitFile() {
    const formData = new FormData();

    if (this.csvColumnIndex !== '') {
      formData.set('index_column', this.csvColumnIndex);
    }

    if (this.file) {
      formData.append('file', this.file);
      this.isLoading = true;
      backendService
        .trainDatamodelWithCSV(
          this.datamodel.id,
          formData,
          AuthModule.accessToken
        )
        .then(() => {
          this.file = undefined;
          this.isLoading = false;
          this.csvColumnIndex = '';
          this.notify('CSV data');
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.train-form {
  padding-left: 400px;
  padding-right: 400px;
}

.train-option {
  margin-top: 10px;
}
</style>
