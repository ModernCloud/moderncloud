<template>
  <div class="info-panel">
    <LogsModal ref="logs" />
    <div class="header">
      <h3>Overview</h3>
      <div class="spinner-border" role="status" v-if="loading">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <perfect-scrollbar class="body" v-if="loading === false" :options="{suppressScrollX: true}">
      <p>Please <router-link :to="{name: 'environments', params: {project_id: this.$store.state.project.selected.id}}">click here</router-link> to manage environments.</p>
      <EnvironmentRow v-for="environment in environments" :key="environment.id" :environment="environment" :file="file" @show-logs="$refs.logs.show"></EnvironmentRow>
    </perfect-scrollbar>
  </div>
</template>

<script>
import LogsModal from '@/components/Environments/LogsModal.vue';
import axios from 'axios';
import EnvironmentRow from "./EnvironmentRow";

export default {
  components: {
    EnvironmentRow,
    LogsModal
  },
  props: {
    file: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      environments: []
    }
  },
  watch: {
    async file() {
      await this.loadEnvironments();
    }
  },
  async mounted() {
    await this.loadEnvironments();
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