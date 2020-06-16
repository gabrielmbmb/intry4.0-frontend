import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import { constRoutes, dynamicRoutes } from '@/router';
import { RouteConfig, Route } from 'vue-router';

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  }

  return true;
};

const filterRoutesByRole = (roles: string[], routes: RouteConfig[]) => {
  const res: RouteConfig[] = [];
  routes.forEach((route) => {
    const r = { ...route };
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterRoutesByRole(roles, r.children);
      }
      res.push(r);
    }
  });
  return res;
};

export interface IPermissionsState {
  routes: RouteConfig[];
  dynamicRoutes: RouteConfig[];
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionsState {
  public routes: RouteConfig[] = [];

  public dynamicRoutes: RouteConfig[] = [];

  @Mutation
  public SET_ROUTES(routes: RouteConfig[]) {
    this.routes = [...constRoutes, ...routes];
    this.dynamicRoutes = routes;
  }

  @Action({ rawError: true })
  public generateRoutes(roles: string[]) {
    let accessedRoutes: RouteConfig[];
    if (roles.includes('superuser')) {
      accessedRoutes = dynamicRoutes;
    } else {
      accessedRoutes = filterRoutesByRole(roles, dynamicRoutes);
    }

    this.SET_ROUTES(accessedRoutes);
    console.log(this.routes);
  }
}

export const PermissionModule = getModule(Permission);
