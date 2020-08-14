<template lang="pug">
div
  vue-particles(color="#f64c72" :particlesNumber="150")
  div.container-login
    div.column.column-logo
      div.column-content
        img(src="@/assets/logo-intry.png" style="width: 500px;")
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
          el-form-item(style="text-align: center;")
            el-button(
              type="primary"
              @click="onClickLogin"
              :disabled="!email && !password"
              :loading="isLogin"
            ) Login
            p(:hidden="haveError").bad-login Wrong login credentials
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

  public haveError = true;

  public async onClickLogin() {
    this.isLogin = true;
    try {
      await AuthModule.login({
        email: this.email,
        password: this.password,
      });
    } catch {
      this.haveError = false;
    }
    this.isLogin = false;
    this.$router.push('/');
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
}

.container-login {
  min-width: 800px;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
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
  background-color: rgba(255, 255, 255, 0.2);
}

.column-login {
  width: 55%;
}

.column-content {
  align-self: center;
}

.bad-login {
  color: red;
}

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background: $primary;
}
</style>
