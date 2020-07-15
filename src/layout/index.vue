<template lang="pug">
div(:class="classObj")
  sidebar.sidebar-container
  div.main-container
    div.fixed-header
      navbar
    section.app-main
      transition
        keep-alive
          router-view(:key="key")
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AppModule } from '@/store/modules/app';
import Sidebar from './components/Sidebar/index.vue';
import Navbar from './components/Navbar/index.vue';

@Component({
  components: {
    Sidebar,
    Navbar,
  },
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar;
  }

  get classObj() {
    return { hideSidebar: !this.sidebar.opened };
  }

  get key() {
    return this.$route.path;
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }
  .sidebar-container {
    width: 54px !important;
  }
  .fixed-header {
    width: calc(100% - 54px);
  }
}

.app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
  height: 100vh;
}
</style>
