<template lang="pug">
div.container
  vue-particles(color="#f64c72" :particlesNumber="150")
  div.container-login
    div.column.column-logo
      div.column-content
        img(src="@/assets/logo-login.png" style="width: 240px;")
        p CAMBIAR EL LOGO IMPORTANTE XD
    div.column.column-login
      div.column-content
        el-form
          h2 Intelligent IndusTry 4.0
          el-form-item
            el-input(
              v-model="email"
              type="email"
              placeholder="email"
            )
          el-form-item
            el-input(
              v-model="password"
              type="password"
              placeholder="password"
            )
          el-form-item
            el-button(
              type="primary"
              @click="onClickLogin"
              :disabled="!email && !password"
              :loading="isLogin"
            ) Login
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AuthModule } from '@/store/modules/auth';

@Component
export default class Login extends Vue {
  public email = '';

  public password = '';

  public isLogin = false;

  public async onClickLogin() {
    this.isLogin = true;
    await AuthModule.login({
      email: this.email,
      password: this.password,
    });
    this.isLogin = false;
    this.$router.push('/');
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/colors.less';

.container {
  height: 100vh;
  display: flex;
  justify-content: center;
}

.container-login {
  width: 40%;
  align-self: center;
  overflow: hidden;
}

.column {
  background-color: white;
  height: 400px;
  float: left;
  display: flex;
  justify-content: center;
}

.column-logo {
  width: 45%;
  background-color: @tertiary;
}

.column-login {
  width: 55%;
}

.column-content {
  align-self: center;
}

#particles-js {
  position: absolute;
  background: @primary;
  left: 0;
  right: 0;
  top: -80px;
  bottom: 0;
  z-index: -1;
}
</style>
