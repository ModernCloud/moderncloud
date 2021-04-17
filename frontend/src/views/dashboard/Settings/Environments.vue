<template>
  <div class="page">
    <DomainModal ref="domainModal" @refresh="loadEnvironments" />
    <LogsModal ref="logs" />
    <EnvironmentModal ref="modal" @updated="loadEnvironments" @added="loadEnvironments" />
    <EnvironmentVariablesModal ref="variables" />
    <notifications position="top center" />
    <div class="content">
      <div class="header">
        <div>
          <div class="title">{{project && project.name ? project.name : null}}: Environments</div>
          <div class="subtitle">Manage your environments</div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-primary" @click="$refs.modal.showAdd()">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /><path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" /></svg>
            New Environment
          </button>
        </div>
      </div>
      <p v-if="initialized === false">Loading...</p>
      <div class="environments" v-if="initialized">
          <EnvironmentRow v-for="environment in environments" :key="environment.id" :environment="environment"
                          @loadEnvironments="loadEnvironments()"
                          @showLogs="$refs.logs.show"
                          @setDomain="$refs.domainModal.showAdd"
                          @showEdit="$refs.modal.showEdit"
                          @showVariables="$refs.variables.show" />
      </div>
    </div>
  </div>
</template>

<script>
import LogsModal from '@/components/Environments/LogsModal.vue';
import DomainModal from '@/components/Settings/Projects/Environments/DomainModal.vue';
import EnvironmentRow from '@/components/Settings/Projects/Environments/EnvironmentRow.vue';
import EnvironmentModal from '@/components/Settings/Projects/Environments/EnvironmentModal.vue';
import EnvironmentVariablesModal from '@/components/Settings/Projects/Environments/EnvironmentVariablesModal.vue';
import axios from "axios";

export default {
  components: {
    DomainModal,
    LogsModal,
    EnvironmentRow,
    EnvironmentModal,
    EnvironmentVariablesModal
  },
  data() {
    return {
      initialized: false,
      loading: false,
      project: null,
      environments: []
    }
  },
  async mounted() {
    await this.loadProject();
    await this.loadEnvironments();
    this.initialized = true;
  },
  methods: {
    async loadProject() {
      this.loading = true;
      try {
        let response = await axios.get('/api/projects/' + this.$route.params.project_id);
        this.project = response.data.project;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async loadEnvironments() {
      this.loading = true;
      try {
        let response = await axios.get('/api/environments?with_last_deployment=true&with_last_success_deployment=true',{
          params: {
            project_id: this.$route.params.project_id
          }
        });
        this.environments = response.data.environments;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async destroy(params) {
      this.loading = true;
      try {
        await axios.post('/api/environments/' + params.environment_id + '/destroy');
        this.$notify({
          title: 'Success',
          type: 'success',
          text: 'Related resources will be destroyed.'
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>