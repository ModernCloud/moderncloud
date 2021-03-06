<template>
  <sui-table-row>
    <LogsModal ref="modal" />
    <sui-table-cell style="text-align: center">
      <sui-button-group size="mini">
        <sui-button content="Deploy" :disabled="isRunning" @click="deploy(environment);" />
        <sui-button content="Edit" :disabled="isRunning" @click="$emit('openEdit', environment.id)" />
      </sui-button-group>
    </sui-table-cell>
    <sui-table-cell>
      <strong>{{environment.name}}</strong>
      <div><small>{{regions[environment.region].name}}</small></div>
    </sui-table-cell>
    <sui-table-cell style="text-align: right" v-if="isRunning">
      <div><sui-label size="mini"><sui-icon name="asterisk" loading /> Running...</sui-label></div>
    </sui-table-cell>
    <sui-table-cell style="text-align: right" v-if="lastDeployment === null && isRunning === false">-</sui-table-cell>
    <sui-table-cell style="text-align: right" v-if="lastDeployment != null && isRunning === false">
      <div v-if="lastDeployment.current_status === 1"><a href="javascript:;" style="font-size: 11px;" @click="$refs.modal.show(lastDeployment.logs)"><sui-label size="mini"><sui-icon name="history" /> Logs</sui-label></a> <sui-label size="mini" color="green">Success</sui-label></div>
      <div v-if="lastDeployment.current_status === 2"><a href="javascript:;" style="font-size: 11px;" @click="$refs.modal.show(lastDeployment.logs)"><sui-label size="mini"><sui-icon name="history" /> Logs</sui-label></a> <sui-label size="mini" color="red">Fail</sui-label></div>
      <small>{{formatDate(lastDeployment.created_at)}}</small>
    </sui-table-cell>
  </sui-table-row>
</template>

<script>
import regions from '../../constants/regions';
import axios from "axios";
import moment from "moment";
import LogsModal from "@/components/Environments/LogsModal";

export default {
  name: 'EnvironmentRow',
  components: {LogsModal},
  props: {
    environment: {
      type: Object
    }
  },
  data() {
    let lastDeployment = this.environment.last_deployment;
    return {
      regions: regions,
      isRunning: (lastDeployment == null || lastDeployment.current_status > 0) === false,
      lastDeployment: lastDeployment,
      timeoutId: null
    }
  },
  destroyed() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
  methods: {
    async deploy() {
      if (this.environment.access_key == null || this.environment.secret_key == null) {
        alert('Please update AWS credentials!');
        return false;
      }
      if (confirm('Are you sure?') === false) {
        return false;
      }
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
          this.lastDeployment = deployment;
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
    formatDate(date) {
      return moment(date).format('DD MMM YYYY HH:mm:ss');
    }
  }
}
</script>