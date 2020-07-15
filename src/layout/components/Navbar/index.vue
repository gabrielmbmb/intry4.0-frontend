<template lang="pug">
  div.navbar
    hamburger(
      :is-active="sidebar.opened"
      @toggleClick="toggleSideBar"
    ).hamburger-container
    breadcrumb.breadcrumb-container
    div.right-menu
      el-dropdown(trigger="click").right-menu-item.hover-effect
        div
          svg-icon(name="user")
        el-dropdown-menu
          router-link(to="/profile")
            el-dropdown-item Profile
          el-dropdown-item(
            divided
            @click.native="logout"
          )
            span(style="display: block;") Logout
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Hamburger from '@/components/Hamburger/index.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { AppModule } from '@/store/modules/app';
import { AuthModule } from '@/store/modules/auth';

@Component({
  components: {
    Hamburger,
    Breadcrumb,
  },
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar;
  }

  private toggleSideBar() {
    AppModule.toggleSidebar();
  }

  private async logout() {
    await AuthModule.logout();
    this.$router.push(`/login?redirect=${this.$route.fullPath}`);
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
  }
}
</style>
