<template>
  <tr>
    <td>
      <a href="javascript:;" @click="$emit('showEdit', environment.id)" title="Edit"><IconEdit :width="16" :height="16" /></a>
      <a href="javascript:;" @click="$emit('showVariables', environment.id)" title="Variables"><IconVariables :width="16" :height="16" :stroke-width="2" /></a>
      <a href="javascript:;" @click="$emit('confirm', {environment_id: environment.id})" title="Destroy"><IconDestroyEnvironment :width="16" :height="16" /></a>
    </td>
    <td>{{environment.name}}</td>
    <td v-if="environment.domain_name == null">
      <a href="javascript:;" @click="$emit('addDomain', environment.id)">Add Domain</a>
    </td>
    <td v-if="environment.domain_name != null">
      {{environment.domain_name}}
      <div style="font-size: 10px;">
        (<a href="javascript:;" @click="show_details = !show_details"><span v-if="show_details === false">Show Details</span><span v-if="show_details">Hide Details</span></a>)
        (<a href="javascript:;" @click="refreshStatus"><span v-if="status_loading === false">Refresh Status</span><span v-if="status_loading">Loading...</span></a>)
        (<a href="javascript:;" @click="$emit('confirmDeleteDomain', {environment_id: environment.id})">Remove Domain</a>)
      </div>
      <div v-if="show_details" style="margin-top: 10px; font-size: 11px; width: 250px; word-wrap: break-word">
        <p>Add the following CNAME record to the DNS configuration for your domain. The procedure for adding CNAME records depends on your DNS service Provider. <a href="https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" target="_blank">DNS Validation</a></p>
        <div class="mb-3">
          <strong>Status</strong>
          <div>{{domainStatus}}</div>
        </div>
        <div class="mb-3">
          <strong><a href="javascript:;" @click="copy(resourceRecord.Name)"><IconClipboard :width="14" :height="14" /></a> Record Name</strong>
          <div>{{resourceRecord.Name}}</div>
        </div>
        <div class="mb-3">
          <strong><a href="javascript:;" @click="copy(resourceRecord.Type)"><IconClipboard :width="14" :height="14" /></a> Type</strong>
          <div>{{resourceRecord.Type}}</div>
        </div>
        <div class="mb-3">
          <strong><a href="javascript:;" @click="copy(resourceRecord.Value)"><IconClipboard :width="14" :height="14" /></a> Value</strong>
          <div>{{resourceRecord.Value}}</div>
        </div>
      </div>
    </td>
    <td style="text-align: right">{{regionName}}</td>
  </tr>
</template>

<script>
import regions from '@/constants/regions';
import IconEdit from "@/components/Icons/IconEdit";
import IconDestroyEnvironment from "@/components/Icons/IconDestroyEnvironment";
import IconVariables from "@/components/Icons/IconVariables";
import get from 'lodash/get';
import IconClipboard from "@/components/Icons/IconClipboard";
import axios from "axios";

export default {
  components: {
    IconClipboard,
    IconEdit,
    IconVariables,
    IconDestroyEnvironment
  },
  props: {
    environment: {
      type: Object
    }
  },
  data() {
    return {
      certificate_validation_options: JSON.parse(this.environment.certificate_validation_options || {}),
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
    }
  }
}
</script>