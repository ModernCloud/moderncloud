<template>
  <div role="main">
    <div class="page">
      <div class="content">
        <div class="header">
          <div>
            <div class="title">Environment Variables</div>
            <div class="subtitle">Manage your environment variables</div>
          </div>
          <div class="actions">
            <button type="button" class="btn btn-primary" @click="addNew">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /><path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" /></svg>
              New Variable
            </button>
            <button type="button" class="btn btn-success" @click="save" style="margin-left: 5px;">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /><path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" /></svg>
              Save Changes
            </button>
          </div>
        </div>
        <p v-if="initialized === false">Loading...</p>
        <table v-if="initialized" class="table table-hover" style="margin-top: 10px;">
          <thead>
          <tr>
            <th style="width: 80px;"></th>
            <th>Name</th>
            <th>Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(variable, index) in variables" :key="variable.id">
            <td valign="middle">
              <a href="javascript:;" @click="variables.splice(index, 1)">Remove</a>
            </td>
            <td>
              <input type="text" class="form-control" v-model="variable.name" tabindex="1" :disabled="loading" />
            </td>
            <td>
              <input type="text" class="form-control" v-model="variable.value" tabindex="1" :disabled="loading" />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      initialized: false,
      loading: false,
      variables: []
    }
  },
  async mounted() {
    await this.loadVariables();
    this.initialized = true;
  },
  methods: {

  }
}
</script>