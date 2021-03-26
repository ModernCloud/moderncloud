<template>
  <div class="logs">
    <LogsModal ref="logs" />
    <div class="menu">
      <div class="environments">
        <a href="javascript:;" v-for="environment in environments" :key="environment.id" :class="{active: selectedEnvironmentId === environment.id}" @click="selectedEnvironmentId = environment.id">{{environment.name}}</a>
      </div>
    </div>
    <div class="log_streams">
      <div class="stream" v-for="(logStream, index) in logStreams" :key="index" @click="$refs.logs.show(selectedEnvironmentId, file.function_name, logStream.logStreamName)">
        <div class="time">Last Event: {{formatDate(logStream.lastIngestionTime)}}</div>
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
      loading: false,
      loadingEnvironments: false,
      loadingLogs: false,
      environments: [],
      selectedEnvironmentId: 0,
      logStreams: [],
      timeoutId: null
    }
  },
  watch: {
    async file() {
      await this.loadEnvironments();
    },
    async selectedEnvironmentId() {
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
        let response = await axios.get('/api/environments',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.environments = response.data.environments;
        this.selectedEnvironmentId = this.environments[0].id;
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingEnvironments = false;
      }
    },
    async loadLogStreams() {
      this.loadingLogs = true;
      try {
        let response = await axios.get(`/api/environments/${this.selectedEnvironmentId}/log-streams/${this.file.function_name}`);
        this.logStreams = response.data.log_streams.logStreams;
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingLogs = false;
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