<template>
  <div class="deployment">
    <LogsModal ref="logs" />
    <EnvironmentVariablesModal ref="variables" />
    <EnvironmentModal ref="environment" @updated="loadEnvironments" @added="loadEnvironments" />
    <section style="padding-left: 8px; padding-right: 8px;">
      <h4>File Details</h4>
      <div>
        <table>
          <tr v-if="file.type === 'endpoint'">
            <th>Endpoint</th>
            <th>:</th>
            <td>
              {{ file.method }}
              {{ file.path }}
            </td>
          </tr>
          <tr v-if="file.description">
            <th>Description</th>
            <th>:</th>
            <td>{{file.description}}</td>
          </tr>
        </table>
      </div>
    </section>
    <router-link class="section-link" :to="{name: 'environments', params: {project_id: this.$store.state.project.selected.id}}">Manage Environments <IconArrowNarrowRight /></router-link>
    <EnvironmentRow v-for="environment in environments" :key="environment.id" :environment="environment" :file="file"
                    @loadEnvironments="loadEnvironments()"
                    @show-logs="$refs.logs.show"
                    @show-variables="$refs.variables.show"
                    @show-edit="$refs.environment.showEdit">
    </EnvironmentRow>
  </div>
</template>

<script>
import LogsModal from '@/components/Environments/LogsModal.vue';
import EnvironmentRow from "./EnvironmentRow";
import axios from 'axios';
import IconArrowNarrowRight from "@/components/Icons/IconArrowNarrowRight";
import EnvironmentVariablesModal from "@/components/Settings/Projects/Environments/EnvironmentVariablesModal";
import EnvironmentModal from "@/components/Settings/Projects/Environments/EnvironmentModal";

export default {
  components: {
    EnvironmentVariablesModal,
    EnvironmentModal,
    IconArrowNarrowRight,
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