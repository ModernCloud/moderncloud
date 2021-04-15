<template>
  <div class="environment">
    <div class="environment-header">
      <div class="name">{{environment.name}}</div>
    </div>
    <div class="info">
      <div class="item">
        <div class="name">Region :</div>
        {{regionName}}
      </div>
      <div class="item">
        <div class="name">Last Deployed :</div>
        <div v-if="environment.last_success_deployment === null">None</div>
        <div v-if="environment.last_success_deployment">{{formatDate(environment.last_success_deployment.updated_at)}}</div>
      </div>
      <div class="item">
        <div class="name">API Gateway :</div>
        <div v-if="environment.api_gateway_url === null">None</div>
        <div v-if="environment.api_gateway_url">{{ environment.api_gateway_url }}</div>
      </div>
    </div>
    <div class="links">
      <a href="javascript:;" @click="$emit('showEdit', environment.id)" class="btn btn-light">Edit</a>
      <a href="javascript:;" @click="$emit('showVariables', environment.id)" class="btn btn-light">Variables</a>
      <a href="javascript:;" class="btn btn-light" v-if="environment.last_success_deployment" @click="$emit('setDomain', environment.id)">Custom Domain</a>
      <div style="margin-left: auto">
        <a href="javascript:;" class="btn btn-light btn-outline-success">Deploy</a>
        <a href="javascript:;" @click="$emit('confirm', {environment_id: environment.id})" class="btn btn-light btn-outline-danger" v-if="environment.last_success_deployment">Destroy</a>
      </div>
    </div>
  </div>
</template>

<script>
import regions from '@/constants/regions';
import get from 'lodash/get';
import axios from "axios";
import moment from "moment";

export default {
  props: {
    environment: {
      type: Object
    }
  },
  data() {
    return {
      certificate_validation_options: JSON.parse(this.environment.certificate_validation_options || '{}'),
      show_details: false,
      status_loading: false
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
    }
  },
  methods: {
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