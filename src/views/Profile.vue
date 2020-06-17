<template lang="pug">
  div.app-container

</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AuthModule } from '@/store/modules/auth';

@Component
export default class Profile extends Vue {}
</script>
