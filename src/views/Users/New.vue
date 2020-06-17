<template lang="pug">
  div.app-container.new-user-form
    h2 New user
    el-form(
      :model="user"
      :rules="formValidationRules"
      ref="newUserForm"
    )
      el-form-item(
        prop="email"
        label="Email"
        :required="true"
      )
        el-input(
          v-model="user.email"
        )
      el-form-item(
        prop="username"
        label="Username"
        :required="true"
      )
        el-input(
          v-model="user.username"
        )
      el-form-item(
        prop="name"
        label="Name"
        :required="true"
      )
        el-input(
          v-model="user.name"
        )
      el-form-item(
        prop="lastname"
        label="Lastname"
        :required="true"
      )
        el-input(
          v-model="user.lastname"
        )
      el-form-item(
        prop="password"
        label="Password"
        :required="true"
      )
        el-input(
          type="password"
          v-model="user.password"
        )
      el-form-item(
        prop="password2"
        label="Repeat password"
        :required="true"
      )
        el-input(
          type="password"
          v-model="user.password2"
        )
      el-form-item
        p.error-msg {{  }}
      el-form-item
        el-button(
          @click="newUser"
        ) Create new user
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import backendService from '../../api/backend.service';
import { AuthModule } from '../../store/modules/auth';

@Component
export default class New extends Vue {
  public user: {
    email: string;
    username: string;
    name: string;
    lastname: string;
    password: string;
    password2: string;
  } = {
    email: '',
    username: '',
    name: '',
    lastname: '',
    password: '',
    password2: '',
  };

  public errorMsg = '';

  public formValidationRules = {
    password2: {
      validator: this.validatePassword,
      trigger: 'blur',
    },
  };

  public validatePassword(rule: any, value: any, callback: Function) {
    if (this.user.password === this.user.password2) {
      callback();
    }

    callback(new Error('Passwords have to match!'));
  }

  public newUser() {
    (this.$refs.newUserForm as any).validate((valid: boolean) => {
      if (valid) {
        backendService
          .createUser(this.user, AuthModule.accessToken)
          .then(() => {
            this.$notify({
              title: 'New user has been created',
              message: `The user ${this.user.username} has been created`,
              type: 'success',
            });
          })
          .catch((err) => {
            this.errorMsg = 'An error has ocurred!';
          });
      }
    });
  }
}
</script>

<style lang="scss">
.new-user-form {
  padding-left: 400px;
  padding-right: 400px;
}
</style>
