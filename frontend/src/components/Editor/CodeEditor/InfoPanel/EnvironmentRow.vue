<template>
  <div class="environment-row">
    <Confirm style="z-index: 6000000" ref="confirmModal" :message="`We are going to deploy your project to the selected (<strong>${environment.name}</strong>) environment. Do you want to continue?`" @yes="deploy" />
    <notifications position="top center" />
    <div>
      <div class="section-header" style="margin-top: 0px;">
        <h3>{{environment.name}}</h3>
        <div class="buttons">
          <button class="btn btn-primary" style="font-size: 11px;" @click="$emit('show-variables', environment.id)">Env</button>
          <button type="button" class="btn btn-primary" style="font-size: 11px" :disabled="isRunning || (hasCredential === false)" @click="$refs.confirmModal.show({})">
            <span v-if="isRunning" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="margin-right: 5px;"></span>
            <span v-if="isRunning">Running</span>
            <span v-if="isRunning === false">Deploy</span>
          </button>
        </div>
      </div>
      <div style="padding: 10px;">
        <div v-if="hasCredential === false" class="alert alert-danger">
          Please update your AWS credentials. <a href="javascript:;" @click="$emit('show-edit', environment.id);">Click here.</a>
        </div>
        <div v-if="environment.last_deployment === null" class="alert alert-warning">
          {{ resourceType }} has not been deployed yet in this environment.
        </div>
        <div v-if="isFileDeployed === false" class="alert alert-warning">
          This is a new <strong>{{ resourceType }}</strong>. Please click to <strong>Deploy</strong> button to see related informations.
        </div>
        <div class="informations" v-if="environment.last_deployment !== null">
          <div class="information">
            <div class="name">Last Status :</div>
            <div class="detail">
              <span class="text-primary" v-if="environment.last_deployment.current_status === 0">Running</span>
              <span class="text-success" v-if="environment.last_deployment.current_status === 1">Success</span>
              <span class="text-danger" v-if="environment.last_deployment.current_status === 2">Failed</span>
              - (<a href="javascript:;" @click="$emit('show-logs', environment.last_deployment.logs)">Logs</a>)
              <div v-if="isRunning">Started {{calculateDiff}} ago</div>
              <div v-if="isRunning === false">Completed in {{calculateDiff}}</div>
            </div>
          </div>
          <div class="information">
            <div class="name">Started :</div>
            <div class="detail">
              {{formatDate(environment.last_deployment.created_at)}}
            </div>
          </div>
          <div class="information">
            <div class="name">Last Update :</div>
            <div class="detail">
              {{formatDate(environment.last_deployment.updated_at)}}
            </div>
          </div>
          <div class="information" v-if="file.type === 'endpoint' && isFileDeployed">
            <div class="name">URL :</div>
            <div class="detail">
              <a href="javascript:;" @click="copyUrl()">{{ environment.api_gateway_url }}{{file.path}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Confirm from "@/components/Confirm";
import moment from "moment";
import axios from "axios";
import has from 'lodash/has';

export default {
  components: {
    Confirm
  },
  props: {
    file: {
      type: Object
    },
    environment: {
      type: Object
    }
  },
  data() {
    return {
      isRunning: (this.environment.last_deployment !== null && this.environment.last_deployment.current_status === 0),
      timeoutId: null
    }
  },
  computed: {
    hasCredential() {
      return !(this.environment.access_key == null
          || this.environment.secret_key == null
          || this.environment.access_key === ''
          || this.environment.secret_key === '');
    },
    resourceType() {
      return this.file.type === 'endpoint' ? 'Endpoint' : 'Function';
    },
    calculateDiff() {
      let lastDate = this.isRunning ? moment.utc() : moment.utc(this.environment.last_deployment.updated_at);
      let seconds = lastDate.diff(moment.utc(this.environment.last_deployment.created_at), 'seconds');
      if (seconds > 59) {
        return `${parseInt(seconds/60)} minutes ${seconds % 60} seconds`;
      }
      return seconds + ' seconds';
    },
    isFileDeployed() {
      return has(this.environment.output, `${this.file.function_name}_invoke_arn`);
    }
  },
  mounted() {
    if (this.isRunning) {
      this.createStatusChecker(this.environment.last_deployment.id);
    }
  },
  destroyed() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
  methods: {
    async deploy() {
      this.isRunning = true;
      try {
        let response = await axios.post('/api/tasks/deploy/run',{
          project_id: this.$store.state.project.selected.id,
          environment_id: this.environment.id
        });
        this.createStatusChecker(response.data.id);
      } catch (e) {
        console.log(e);
        this.isRunning = false;
        this.$notify({
          title: 'Failed',
          type: 'danger',
          text: 'Please try again!'
        });
      }
    },
    createStatusChecker(deploymentId) {
      this.timeoutId = setTimeout(() => {
        axios.get('/api/tasks/' + deploymentId).then(response => {
          let deployment = response.data.task;
          deployment.logs = response.data.logs;
          this.environment.last_deployment = deployment;
          if (deployment.current_status === 0) {
            this.isRunning = true;
            this.createStatusChecker(deploymentId);
          } else {
            this.timeoutId = null;
            this.isRunning = false;
            this.$emit('loadEnvironments');
          }
        });
      }, 1000);
    },
    async copyUrl() {
      let url = this.environment.api_gateway_url + this.file.path;
      await navigator.clipboard.writeText(url);
      this.$notify({
        title: 'Success',
        type: 'success',
        text: 'URL copied!'
      });
    },
    formatDate(date) {
      return moment(date).format('DD MMM YYYY HH:mm:ss');
    }
  }
}
</script>