<template lang="pug">
div.notification-item
  svg-icon(:name="icon" width="25" height="25")
  p {{ message }} 
    el-button(
      @click="emitClickEvent"
      size="mini"
    ) View
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

  public emitClickEvent() {
    this.$emit('buttonClick');
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  background: $primary;
  color: $tertiary;
  padding: 5px;
  border-radius: 25%;
}

p {
  display: inline;
  margin-left: 5px;
  margin-right: 5px;
}

.notification-item {
  margin-top: 10px;
  padding: 5px;
}
</style>
