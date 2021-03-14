<template>
  <div class="drawer info-panel" v-if="visible" @click.self="visible = false;">
    <LogsModal ref="logs" />
    <div class="wrapper">
      <div class="header">
        <div class="title">
          <small v-if="file.type === 'endpoint'" :style="{
                  'display': 'inline-block',
                  'font-weight': 600,
                  'margin-right': '5px',
                  'color': methodLabelColor(file.method),
                  'font-size': '13px'
                }">{{file.method}}</small>
          <svg v-if="file.type === 'function'" style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 10h1c1 0 1 1 2.016 3.527c.984 2.473 .984 3.473 1.984 3.473h1" /><path d="M13 17c1.5 0 3 -2 4 -3.5s2.5 -3.5 4 -3.5" /><path d="M3 19c0 1.5 .5 2 2 2s2 -4 3 -9s1.5 -9 3 -9s2 .5 2 2" /><line x1="5" y1="12" x2="11" y2="12" /></svg>
          {{file.name}}
        </div>
        <a href="javascript:;" class="close" @click="visible = false">
          <div class="spinner-border" role="status" v-if="loading">
            <span class="visually-hidden">Loading...</span>
          </div>
          <svg v-if="loading === false" xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </a>
      </div>
      <div class="body" v-if="loading === false" >
        <p>Please <router-link :to="{name: 'environments', params: {project_id: this.$store.state.project.selected.id}}">click here</router-link> to manage environments.</p>
        <EnvironmentRow v-for="environment in environments" :key="environment.id" :environment="environment" :file="file" @show-logs="$refs.logs.show"></EnvironmentRow>
      </div>
    </div>
  </div>
</template>

<script>
import LogsModal from '../Environments/LogsModal.vue';
import axios from 'axios';
import EnvironmentRow from "./EnvironmentRow";

export default {
  components: {
    EnvironmentRow,
    LogsModal
  },
  data() {
    return {
      loading: false,
      file: {
        id: null,
        name: null,
        type: null
      },
      environments: [],
      visible: false
    }
  },
  methods: {
    async loadEnvironments() {
      this.loading = true;
      try {
        let response = await axios.get('/api/environments?with_last_deployment=true&with_last_success_deployment=true',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.environments = response.data.environments;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    show(file) {
      this.visible = true;
      this.file = file;
      this.loadEnvironments();
    },
    methodLabelColor(method) {
      if (method === 'POST') {
        return '#f77f00';
      } else if (method === 'DELETE') {
        return '#d62828';
      } else if (method === 'PUT') {
        return '#0077b6';
      } else {
        return '#55a630';
      }
    }
  }
}
</script>