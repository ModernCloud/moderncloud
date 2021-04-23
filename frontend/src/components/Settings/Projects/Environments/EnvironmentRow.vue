<template>
  <div class="environment">
    <Confirm style="z-index: 6000000" ref="confirmModal" :message="`We are going to deploy your project to the selected (<strong>${environment.name}</strong>) environment. Do you want to continue?`" @yes="deploy" />
    <Confirm style="z-index: 6000000" ref="confirmDestroyModal" :message="`We are going to destroy your environment's (<strong>${environment.name}</strong>) resources. Do you want to continue?`" @yes="destroy" />
    <div class="environment-header">
      <div class="name">{{environment.name}}</div>
    </div>
    <div class="info">
      <div class="item">
        <div class="name">Region :</div>
        {{regionName}}
      </div>
      <div class="item">
        <div class="name">Last Status :</div>
        <div v-if="environment.last_deployment === null">None</div>
        <div v-if="environment.last_deployment !== null">
          <div class="detail">
            <span class="text-primary" v-if="environment.last_deployment.current_status === 0">Running</span>
            <span class="text-success" v-if="environment.last_deployment.current_status === 1">Success</span>
            <span class="text-danger" v-if="environment.last_deployment.current_status === 2">Failed</span>
            - (<a href="javascript:;" @click="$emit('showLogs', environment.last_deployment.logs)">Logs</a>)
            <div v-if="isRunning">Started {{calculateDiff}} ago</div>
            <div v-if="isRunning === false && environment.last_success_deployment !== null">{{formatDate(environment.last_success_deployment.updated_at)}}</div>
            <div v-if="isRunning === false">Completed in {{calculateDiff}}</div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="name">API Gateway :</div>
        <div v-if="environment.api_gateway_url === null">None</div>
        <div v-if="environment.api_gateway_url">{{ environment.api_gateway_url }}</div>
      </div>
    </div>
    <div class="links" v-if="isRunning === false">
      <a href="javascript:;" @click="$emit('showEdit', environment.id)" class="btn btn-light">Edit</a>
      <a href="javascript:;" @click="$emit('showVariables', environment.id)" class="btn btn-light">Variables</a>
      <a href="javascript:;" class="btn btn-light" v-if="environment.last_success_deployment" @click="$emit('setDomain', environment.id)">Custom Domain</a>
      <div style="margin-left: auto" v-if="environment.access_key != null && environment.access_key !== '' && environment.secret_key != null && environment.secret_key != ''">
        <a href="javascript:;" class="btn btn-light" @click="$refs.confirmModal.show({})">Deploy</a>
        <a href="javascript:;" class="btn btn-light" @click="$refs.confirmDestroyModal.show({})" v-if="environment.api_gateway_arn">Destroy</a>
      </div>
    </div>
  </div>
</template>

<script>
import Confirm from "@/components/Confirm";
import regions from '@/constants/regions';
import get from 'lodash/get';
import axios from "axios";
import moment from "moment";

export default {
  components: {
    Confirm
  },
  props: {
    environment: {
      type: Object
    }
  },
  data() {
    return {
      certificate_validation_options: JSON.parse(this.environment.certificate_validation_options || '{}'),
      show_details: false,
      status_loading: false,
      isRunning: (this.environment.last_deployment !== null && this.environment.last_deployment.current_status === 0),
      timeoutId: null
    }
  },
  computed: {
    regionName() {
      return regions[this.environment.region].name;
    },
    domainStatus() {
      return get(this.certificate_validation_options, 'ValidationStatus', 'PENDING_VALIDATION');
    },
    resourceRecord() {
      return get(this.certificate_validation_options, 'ResourceRecord', {});
    },
    calculateDiff() {
      let lastDate = this.isRunning ? moment.utc() : moment.utc(this.environment.last_deployment.updated_at);
      let seconds = lastDate.diff(moment.utc(this.environment.last_deployment.created_at), 'seconds');
      if (seconds > 59) {
        return `${parseInt(seconds / 60)} minutes ${seconds % 60} seconds`;
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
        let response = await axios.post('/api/tasks/deploy/run',{
          project_id: this.$store.state.project.selected.id,
          environment_id: this.environment.id
        });
        this.createStatusChecker(response.data.id);
      } catch (e) {
        console.log(e);
        this.isRunning = false;
      }
    },
    async destroy() {
      this.isRunning = true;
      try {
        let response = await axios.post('/api/tasks/destroy/run',{
          project_id: this.$store.state.project.selected.id,
          environment_id: this.environment.id
        });
        this.createStatusChecker(response.data.id);
      } catch (e) {
        console.log(e);
        this.isRunning = false;
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
    async refreshStatus() {
      this.status_loading = true;
      try {
        let response = await axios.get(`/api/environments/${this.environment.id}?refresh_certificate_validation_options=true`);
        this.certificate_validation_options = JSON.parse(response.data.environment.certificate_validation_options || {});
      } catch (e) {
        console.log(e);
      } finally {
        this.status_loading = false;
      }
    },
    formatDate(date) {
      return moment(date).format('DD MMM YYYY HH:mm:ss Z');
    },
  }
}
</script>