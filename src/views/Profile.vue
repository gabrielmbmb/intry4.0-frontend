<template lang="pug">
  div.app-container
    h2 Profile
    ul
      li
        strong Full name:
        |  {{ name }}
      li
        strong Email:
        |  {{ email }}
      li
        strong Roles:
          ul
            li(v-for="role in roles") {{ role }}
    h3 Change password
    el-form(
      :model="formData"
      :rules="formValidationRules"
      ref="form"
      inline
    ).form
      el-form-item(
        label="Old password"
        prop="old_password"
      )
        el-input(
          v-model="formData.old_password"
          type="password"
          placeholder="Old password..."
        )
      el-form-item(
        label="New password"
        prop="password"
      )
        el-input(
          v-model="formData.password"
          type="password"
          placeholder="New password..."
        )
      el-form-item(
        label="Repeat password"
        prop="password2"
      )
        el-input(
          v-model="formData.password2"
          type="password"
          placeholder="Repeat password..."
        )
      el-form-item
        el-button(
          type="primary"
          @click="changePassword"
        ) Change password
    p.error-msg
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Ref } from 'vue-property-decorator';
import { AuthModule } from '@/store/modules/auth';
import { Form } from 'element-ui';
import backendService from '../api/backend.service';

@Component
export default class Profile extends Vue {
  @Ref('form') public readonly form!: Form;

  public formData: {
    old_password: string;
    password: string;
    password2: string;
  } = {
    old_password: '',
    password: '',
    password2: '',
  };

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
    if (this.formData.password === this.formData.password2) {
      callback();
    }

    callback(new Error('Passwords have to match!'));
  }

  public get name() {
    return AuthModule.name;
  }

  public get email() {
    return AuthModule.email;
  }

  public get roles() {
    return AuthModule.roles;
  }

  public changePassword() {
    this.form.validate((valid: boolean) => {
      if (valid) {
        backendService
          .updatePassword(this.formData, AuthModule.accessToken)
          .then(() => {
            this.$notify({
              title: 'Password updated',
              message: 'The password has been updated successfully',
              type: 'success',
            });
            this.form.resetFields();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-left: 20px;
}

.error-msg {
  color: red;
}
</style>
