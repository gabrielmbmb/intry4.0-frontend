<template lang="pug">
  h1 {{ `Anomaly Detection Model: ${datamodel.name}` }}


</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import backendService from '@/api/backend.service';
import { AxiosResponse } from 'axios';
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
        console.log(this.datamodel);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
</script>
