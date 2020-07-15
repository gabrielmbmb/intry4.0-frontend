<template lang="pug">
  el-breadcrumb(separator="/").app-breadcrumb
    el-breadcrumb-item(
      v-for="(route, index) in breadcrumbs"
      :key="route.path"
    )
      //- No link because 'noredirect' or it's the last route in the breadcrumb
      span(
        v-if="route.redirect === 'noredirect' || index === breadcrumbs.length - 1"
      ) {{ route.meta.title.toLowerCase()}}
      //- Link to the route
      a(
        v-else
        @click.prevent="routeClick(route)"
      ) {{ route.meta.title.toLowerCase() }}
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { RouteRecord } from 'vue-router';

@Component({
  name: 'Breadcrumb',
})
export default class extends Vue {
  get breadcrumbs(): RouteRecord[] {
    const matched = this.$route.matched.filter(
      (route) => route.meta && route.meta.title
    );

    // check if the first matched route is the home. If not,
    // append a new route to the home view.
    if (matched[0].name !== 'Home') {
      matched.unshift({
        path: '/home',
        meta: { title: 'home' },
      } as RouteRecord);
    }

    return matched;
  }

  public routeClick(route: RouteRecord) {
    this.$router.push(route.path);
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 16px;
  line-height: 50px;
  margin-left: 8px;
}
</style>
