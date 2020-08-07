<template lang="pug">
  div.app-container.new-user-form
    h2 New user
    el-form(
      inline
      :model="user"
      :rules="formValidationRules"
      label-position="top"
      ref="newUserForm"
      size="small"
    ).user-form
      el-form-item(
        prop="email"
        label="Email"
        :required="true"
      )
        el-input(
          v-model="user.email"
          prefix-icon="el-icon-message"
          placeholder="User email..."
        )
      el-form-item(
        prop="username"
        label="Username"
        :required="true"
      )
        el-input(
          v-model="user.username"
          placeholder="Username..."
        )
      el-form-item(
        prop="name"
        label="Name"
        :required="true"
      )
        el-input(
          v-model="user.name"
          placeholder="Name..."
        )
      el-form-item(
        prop="lastname"
        label="Lastname"
        :required="true"
      )
        el-input(
          v-model="user.lastname"
          placeholder="Lastname..."
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
          placeholder="Password..."
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
          placeholder="Repeat password..."
        )
      el-form-item(
        prop="is_staff"
        label="Staff"
        :required="true"
      )
        el-tooltip(content="Whether the user is member of the staff")
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
import { Component, Ref } from 'vue-property-decorator';
import EventBus from '@/utils/eventBus';
import { Form } from 'element-ui';
import backendService from '../../api/backend.service';
import { AuthModule } from '../../store/modules/auth';

@Component
export default class New extends Vue {
  @Ref('newUserForm') public readonly newUserForm!: Form;

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

  public deactivated() {
    this.newUserForm.resetFields();
  }

  public validatePassword(rule: any, value: any, callback: Function) {
    if (this.user.password === this.user.password2) {
      callback();
    }

    callback(new Error('Passwords have to match!'));
  }

  public newUser() {
    this.isUserBeingCreated = true;
    this.newUserForm.validate((valid: boolean) => {
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
.user-form {
  .el-form-item {
    width: 45%;
    margin-left: 20px;
  }
}

@media only screen and (max-width: 770px) {
  .user-form {
    .el-form-item {
      width: 90%;
      margin-left: none;
    }
  }
}
</style>
