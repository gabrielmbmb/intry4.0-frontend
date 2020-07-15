<template lang="pug">
  div(
    v-if="!item.meta || !item.meta.hidden"
    :class="[isCollapse ? 'simple-mode' : 'full-mode', { 'first-level': isFirstLevel }]"
  )
    template(v-if="onlyOneChild")
      sidebar-item-link(
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path)"
      )
        el-menu-item(
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown': isFirstLevel}"
        )
          svg-icon(
            v-if="onlyOneChild.meta.icon"
            :name="onlyOneChild.meta.icon"
            width="20"
            height="20"
          )
          span(
            v-if="onlyOneChild.meta.title"
            slot="title"
          ) {{ onlyOneChild.meta.title }}
    el-submenu(
      v-else
      :index="resolvePath(item.path)"
      popper-append-to-body
    )
      template(slot="title")
        svg-icon(
          v-if="item.meta.icon"
          :name="item.meta.icon"
          width="20"
          height="20"
        )
        span(
          slot="title"
          v-if="item.meta"
        ) {{ item.meta.title }}
      template(v-if="item.children")
        sidebar-item(
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :isCollapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(item.path)"
        ).nest-menu
</template>

<script lang="ts">
import path from 'path';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import SidebarItemLink from './SidebarItemLink.vue';

@Component({
  name: 'SidebarItem',
  components: {
    SidebarItemLink,
  },
})
export default class extends Vue {
  @Prop({ required: true }) private item!: RouteConfig;

  @Prop({ default: false }) private isCollapse!: boolean;

  @Prop({ default: true }) private isFirstLevel!: boolean;

  @Prop({ default: '' }) private basePath!: string;

  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false;
        }

        return true;
      });
      return showingChildren.length;
    }

    return 0;
  }

  get onlyOneChild() {
    if (this.showingChildNumber > 1) {
      return null;
    }

    if (this.item.children) {
      for (const child of this.item.children) {
        if (!child.meta || !child.meta.hidden) {
          return child;
        }
      }
    }

    return this.item;
  }

  private resolvePath(routePath: string) {
    return path.resolve(this.basePath, routePath);
  }
}
</script>

<style lang="scss">
.full-mode {
  .nest-menu .el-submenu > .el-submenu__title,
  .el-submenu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}

.el-menu-item.is-active {
  color: $tertiary !important;
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;
      .el-tooltip {
        padding: 0 !important;
      }
    }
    .el-submenu {
      overflow: hidden;
      & > .el-submenu__title {
        padding: 0px !important;
        .el-submenu__icon-arrow {
          display: none;
        }
        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
