<template lang="pug">
div.notification-item
  svg-icon(:name="icon" width="30" height="30")
  p {{ message }}
  el-button(size="mini") View
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'NotificationItem',
})
export default class extends Vue {
  @Prop({ required: true }) public icon!: string;

  @Prop({ required: true }) public message!: string;
}
</script>

<style lang="scss" scoped>
p {
  display: inline;
  margin-left: 5px;
  margin-right: 5px;
}

.notification-item {
  border: 1px solid black;
  border-radius: 5px;
  margin-top: 10px;
  padding: 5px;
}
</style>
