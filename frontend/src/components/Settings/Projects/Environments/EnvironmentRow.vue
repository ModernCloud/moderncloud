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
      <div class="item" v-if="environment.last_success_deployment">
        <div class="name">Last Deployed :</div>
        {{formatDate(environment.last_success_deployment.updated_at)}}
      </div>
    </div>
    <div class="links">
      <a href="javascript:;" @click="$emit('showEdit', environment.id)" class="btn btn-light">Edit</a>
      <a href="javascript:;" @click="$emit('showVariables', environment.id)" class="btn btn-light">Variables</a>
      <a href="javascript:;" class="btn btn-light">Domains</a>
      <a href="javascript:;" @click="$emit('confirm', {environment_id: environment.id})" class="btn btn-light btn-outline-danger">Destroy</a>
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
    async copy(data) {
      await navigator.clipboard.writeText(data);
      this.$notify({
        title: 'Success',
        type: 'success',
        text: 'Copied!'
      });
    },
    formatDate(date) {
      return moment(date).format('DD MMM YYYY HH:mm:ss Z');
    },
  }
}
</script>

<style lang="scss" scoped>
.environment {
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

  .environment-header {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;

    .name {
      font-size: 18px;
      font-weight: 500;

      .region {
        font-size: 12px;
        color: rgba(0, 0, 0, .5);
        font-weight: 400;
      }
    }
  }

  .links {
    margin-top: 5px;
    display: flex;

    a {
      font-size: 11px;
      margin-right: 5px;
      min-width: auto;

      &:hover {
        background: rgba(0, 0, 0, .16);
      }
    }
  }

  .info {
    font-size: 12px;
    color: rgba(0, 0, 0, .5);
    margin-top: 10px;

    .item {
      margin-bottom: 10px;
      border-left: 1px dashed rgba(0, 0, 0, .1);
      padding-left: 5px;

      .name {
        font-weight: bold;
      }
    }
  }
}
</style>