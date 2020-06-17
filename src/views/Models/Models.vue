<template lang="pug">
div.app-container
  h2 Anomaly Detection Models
  el-row(:gutter="20")
    el-col(:span="24")
      el-table(
        :default-sort="{ prop: 'id', order: 'ascending' }"
        :data="users"
      )
        el-table-column(
          prop="id"
          label="ID"
          width="50"
        )
        el-table-column(
          prop="email"
          label="Email"
        )
        el-table-column(
          prop="name"
          label="Name"
        )
        el-table-column(
          prop="lastname"
          label="Lastname"
        )
        el-table-column(
          prop="is_active"
          label="Active"
        )
          template(slot-scope="scope")
            p {{ scope.row.is_active ? 'Yes' : 'No' }}
        el-table-column(
          prop="role"
          label="Role"
        )
          template(slot-scope="scope")
            p {{ scope.row.is_staff ? 'Staff' : 'User' }}
        el-table-column(
          prop="buttons"
        )
          template(slot-scope="scope")
            el-button(
              size="mini"
              @click="setUserState(scope.row)"
            ) {{ scope.row.is_active ? 'Set unactive' : 'Set active' }}
            el-popconfirm(
              title="Are you sure you want to remove this user?"
              confirmButtonText="Yes"
              cancelButtonText="No"
              confirmButtonType="danger"
              @onConfirm="deleteUser(scope.row)"
            )
              el-button(
                slot="reference"
                size="mini"
                type="danger"
                style="margin-left: 10px;"
              ) Remove</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Models extends Vue {}
</script>
