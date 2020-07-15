<template lang="pug">
div.app-container.new-user-form
  h2 Train model: {{ datamodel.name }}
  p Train with data from:
  el-radio(v-model="trainSource" label="db") Database
  el-radio(v-model="trainSource" label="csv") CSV

  div(v-if="trainSource === 'db'")
    p Number of first N-rows to take to train:
    el-form
      el-form-item Column index:
        el-input(
          v-model="trainNRows"
          style="width: 200px; margin-left: 10px;"
        )
      el-form-item
        el-button(
          @click="submit"
          :loading="isLoading"
        ) Train
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
import { AuthModule } from '../../store/modules/auth';

@Component
export default class TrainModel extends Vue {
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
    if ((this.$refs.file as HTMLInputElement).files![0].type === 'text/csv') { // eslint-disable-line
      this.fileUploaded = true;
      this.file = (this.$refs.file as HTMLInputElement).files![0]; // eslint-disable-line
    }
  }

  public notify() {
    this.$notify({
      title: 'Train with csv started',
      message: `The training process started for model ${this.datamodel.name} has started`,
      type: 'success',
    });
    EventBus.$emit('update-models');
    this.$router.push('/models/index');
  }

  public submit() {
    this.isLoading = true;
    backendService
      .trainDatamodel(
        this.datamodel.id,
        { n: this.trainNRows },
        AuthModule.accessToken
      )
      .then(() => {
        this.notify();
        this.isLoading = false;
      })
      .catch((err) => {
        this.isLoading = false;
        console.log(err);
      });
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
          this.notify();
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
</style>
