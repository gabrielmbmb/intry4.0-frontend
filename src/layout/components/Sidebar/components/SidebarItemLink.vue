<template lang="pug">
  router-link(:to="to")
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'SidebarItemLink',
})
export default class extends Vue {
  @Prop({ required: true }) private to!: string;
}
</script>
