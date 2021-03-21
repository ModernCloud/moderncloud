<template>
  <div>
    <Confirm style="z-index: 6000000" ref="confirmModal" :message="`We are going to deploy your project to the selected (<strong>${environment.name}</strong>) environment. Do you want to continue?`" @yes="deploy" />
    <notifications position="top center" />
    <div style="border-radius: 4px; border: 1px solid #ddd; margin-bottom: 20px;">
      <div class="section-header" style="margin-top: 0px;">
        <h3>Environment: {{environment.name}}</h3>
        <button type="button" class="btn btn-primary" :disabled="isRunning || (this.environment.access_key == null || this.environment.secret_key == null)" @click="$refs.confirmModal.show({})">
          <span v-if="isRunning" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="margin-right: 5px;"></span>
          <span v-if="isRunning">Running</span>
          <span v-if="isRunning === false">Deploy</span>
        </button>
      </div>
      <div style="padding: 10px;">
        <div v-if="this.environment.access_key == null || this.environment.secret_key == null" class="alert alert-danger">
          Please update AWS credentials!
        </div>
        <div v-if="environment.last_deployment === null" class="alert alert-warning">
          {{ resourceType }} has not been deployed yet in this environment.
        </div>
        <div v-if="environment.last_deployment !== null && hasSuccessDeployment() === false" class="alert alert-warning">
          This is a new <strong>{{ resourceType }}</strong>. Please click to <strong>Deploy</strong> button to see related informations.
        </div>
        <table v-if="environment.last_deployment !== null">
          <tr>
            <th valign="top" rowspan="2" style="width: 90px;">Last Status</th>
            <td>:</td>
            <td>
              <span class="text-primary" v-if="environment.last_deployment.current_status === 0">Running</span>
              <span class="text-success" v-if="environment.last_deployment.current_status === 1">Success</span>
              <span class="text-danger" v-if="environment.last_deployment.current_status === 2">Failed</span>
              (<a href="javascript:;" @click="$emit('show-logs', environment.last_deployment.logs)">Logs</a>)
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="text-muted" v-if="isRunning">Started {{calculateDiff}} ago</td>
            <td class="text-muted" v-if="isRunning === false">Completed in {{calculateDiff}}</td>
          </tr>
          <tr>
            <th>Started</th>
            <td>:</td>
            <td>{{formatDate(environment.last_deployment.created_at)}}</td>
          </tr>
          <tr>
            <th>Last Update</th>
            <td>:</td>
            <td>{{formatDate(environment.last_deployment.updated_at)}}</td>
          </tr>
          <tr v-if="file.type === 'endpoint' && hasSuccessDeployment()">
            <th>URL</th>
            <td>:</td>
            <td>
              <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 450px;">
                <a href="javascript:;" @click="copyUrl()">{{ apiUrl() }}{{file.path}}</a>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Confirm from "@/components/Confirm";
import moment from "moment";
import axios from "axios";

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
      isRunning: (this.environment.last_deployment == null || this.environment.last_deployment.current_status > 0) === false,
      timeoutId: null
    }
  },
  computed: {
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
        let response = await axios.post('/api/deployments',{
          project_id: this.$store.state.project.selected.id,
          environment_id: this.environment.id
        });
        this.createStatusChecker(response.data.id);
      } catch (e) {
        console.log(e);
      }
    },
    createStatusChecker(deploymentId) {
      this.timeoutId = setTimeout(() => {
        axios.get('/api/deployments/' + deploymentId).then(response => {
          let deployment = response.data.deployment;
          deployment.logs = response.data.logs;
          this.environment.last_deployment = deployment;
          if (response.data.deployment.current_status === 0) {
            this.isRunning = true;
            this.createStatusChecker(deploymentId);
          } else {
            this.timeoutId = null;
            this.isRunning = false;
          }
        });
      }, 1000);
    },
    async copyUrl() {
      let url = this.apiUrl() + this.file.path;
      await navigator.clipboard.writeText(url);
      this.$notify({
        title: 'Success',
        type: 'success',
        text: 'URL copied!'
      });
    },
    formatDate(date) {
      return moment(date).format('DD MMM YYYY HH:mm:ss');
    },
    apiUrl() {
      let json = JSON.parse(this.environment.last_success_deployment.output);
      return json.api_url.value;
    },
    hasSuccessDeployment() {
      if (this.environment.last_success_deployment === null || this.environment.last_success_deployment.output === null) {
        return false;
      }
      let json = JSON.parse(this.environment.last_success_deployment.output);
      for (const key of Object.keys(json)) {
        if (key.indexOf(this.file.function_name) > -1) {
          return true;
        }
      }
      return false;
    },
  }
}
</script>