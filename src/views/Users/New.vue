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
        :min="8"
        :required="true"
      )
        el-input(
          type="password"
          v-model="user.password"
        )
      el-form-item(
        prop="password2"
        label="Repeat password"
        :min="8"
        :required="true"
      )
        el-input(
          type="password"
          v-model="user.password2"
        )
      el-form-item(
        prop="is_staff"
        label="Staff"
        :required="true"
      )
        el-checkbox(
          v-model="user.is_staff"
          label="true"
        ) Yes
      el-form-item
        p.error-msg {{  }}
      el-form-item
        el-button(
          :loading="isUserBeingCreated"
          @click="newUser"
        ) Create new user
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import EventBus from '@/utils/eventBus';
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
    is_staff: boolean;
  } = {
    email: '',
    username: '',
    name: '',
    lastname: '',
    password: '',
    password2: '',
    is_staff: false,
  };

  public errorMsg = '';

  public isUserBeingCreated = false;

  public formValidationRules = {
    password: {
      min: 8,
      message: 'The password must be at least 8 characters!',
      trigger: 'blur',
    },
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
    this.isUserBeingCreated = true;
    (this.$refs.newUserForm as any).validate((valid: boolean) => {
      if (valid) {
        backendService
          .createUser(this.user, AuthModule.accessToken)
          .then(() => {
            this.isUserBeingCreated = false;
            this.$notify({
              title: 'New user has been created',
              message: `The user ${this.user.username} has been created`,
              type: 'success',
            });
            (this.$refs.newUserForm as any).resetFields();
            EventBus.$emit('update-users');
            this.$router.push('index');
          })
          .catch(() => {
            this.isUserBeingCreated = false;
            this.errorMsg = 'An error has ocurred!';
          });
      } else {
        this.isUserBeingCreated = false;
      }
    });
  }
}
</script>

<style lang="scss">
// .new-user-form {
//   padding-left: 400px;
//   padding-right: 400px;
// }
</style>
