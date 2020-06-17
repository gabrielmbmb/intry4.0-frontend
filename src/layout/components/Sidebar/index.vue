<template lang="pug">
  div
    sidebar-logo(
      v-if="true"
      :collapse="isCollapse"
    )
    el-scrollbar(wrap-class="scrollbar-wrapper")
      el-menu(
        :collapse="isCollapse"
        :collapse-transition="false"
        :background-color="styleVariables.menuBg"
        :text-color="styleVariables.menuText"
        mode="vertical"
      )
        sidebar-item(
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :isCollapse="isCollapse"
          :base-path="route.path"
        )
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { PermissionModule } from '@/store/modules/permission';
import { AppModule } from '@/store/modules/app';
import variables from '@/styles/_variables.scss';
import SidebarItem from './components/SidebarItem.vue';
import SidebarLogo from './components/SidebarLogo.vue';

@Component({
  components: {
    SidebarItem,
    SidebarLogo,
  },
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar;
  }

  get routes() {
    return PermissionModule.routes;
  }

  get isCollapse() {
    return !this.sidebar.opened;
  }

  get styleVariables() {
    return variables;
  }
}
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  .el-scrollbar__view {
    height: 100%;
  }
  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }
    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
