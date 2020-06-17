import Cookies from 'js-cookie';

// App
const sidebarStatusKey = 'intry_sidebar_status';
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (status: string) =>
  Cookies.set(sidebarStatusKey, status);

// Auth
const tokenKey = 'intry_access_token';
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) => Cookies.set(tokenKey, token);
export const removeToken = () => Cookies.remove(tokenKey);
