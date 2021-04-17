<template>
  <div class="logs">
    <LogsModal ref="logs" />
    <div class="menu">
      <div class="environments">
        <a href="javascript:;" v-for="environment in environments" :key="environment.id" :class="{active: selectedEnvironment.id === environment.id}" @click="selectedEnvironment = environment">{{environment.name}}</a>
      </div>
    </div>
    <div class="log_streams">
      <div v-if="initialized === false">...</div>
      <div class="stream" v-for="(logStream, index) in logStreams" :key="index" @click="$refs.logs.show(selectedEnvironment.id, file.function_name, logStream.logStreamName)">
        <div class="time">{{formatDate(logStream.lastIngestionTime)}}</div>
        <div class="name">{{logStream.logStreamName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LogsModal from './LogsModal.vue';
import axios from 'axios';
import moment from 'moment';

export default {
  components: {
    LogsModal
  },
  props: {
    file: {
      type: Object
    }
  },
  data() {
    return {
      initialized: false,
      loading: false,
      loadingEnvironments: false,
      loadingLogs: false,
      environments: [],
      selectedEnvironment: {id: null},
      logStreams: [],
      timeoutId: null
    }
  },
  watch: {
    async file() {
      await this.loadEnvironments();
    },
    async selectedEnvironment() {
      this.initialized = false;
      this.logStreams = [];
      await this.loadLogStreams();
    }
  },
  async mounted() {
    await this.loadEnvironments();
  },
  destroyed() {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
  },
  methods: {
    async loadEnvironments() {
      this.loadingEnvironments = true;
      try {
        let response = await axios.get('/api/environments?with_last_success_deployment=true',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.environments = response.data.environments;
        this.selectedEnvironment = this.environments[0];
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingEnvironments = false;
      }
    },
    async loadLogStreams() {
      if (this.timeoutId != null) {
        clearTimeout(this.timeoutId);
      }
      if (this.selectedEnvironment.id != null && this.selectedEnvironment.last_success_deployment == null) {
        this.logStreams = [];
        this.initialized = true;
        return;
      }
      this.loadingLogs = true;
      try {
        let response = await axios.get(`/api/environments/${this.selectedEnvironment.id}/log-streams/${this.file.function_name}`);
        this.logStreams = response.data.log_streams.logStreams;
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingLogs = false;
        this.initialized = true;
        this.timeoutId = setTimeout(async () => {
          if (this.loadingLogs) {
            return;
          }
          await this.loadLogStreams();
        }, 10000);
      }
    },
    formatDate(timestamp) {
      return moment(timestamp).format('DD MM YYYY HH:mm:ss Z');
    }
  }
}
</script>