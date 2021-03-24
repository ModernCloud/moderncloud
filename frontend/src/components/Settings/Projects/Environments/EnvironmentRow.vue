<template>
  <tr>
    <td>
      <a href="javascript:;" @click="$emit('showEdit')" title="Edit"><IconEdit :width="16" :height="16" /></a>
      <a href="javascript:;" @click="$emit('showVariables')" title="Variables"><IconVariables :width="16" :height="16" :stroke-width="2" /></a>
      <a href="javascript:;" @click="$emit('confirm')" title="Destroy"><IconDestroyEnvironment :width="16" :height="16" /></a>
    </td>
    <td>{{environment.name}}</td>
    <td>
      {{environment.domain_name}}
      <div style="font-size: 10px;" v-if="domainStatus">(<a href="javascript:;" @click="show_details = !show_details"><span v-if="show_details === false">Show Details</span><span v-if="show_details">Hide Details</span></a>)</div>
      <div v-if="show_details" style="margin-top: 10px; font-size: 11px;">
        <p>Add the following CNAME record to the DNS configuration for your domain. The procedure for adding CNAME records depends on your DNS service Provider.</p>
        <div v-for="option of domainValidationOptions" :key="option.domain_name">
          <div class="mb-3">
            <strong><a href="javascript:;" @click="copy(option.resource_record_name.slice(0, option.resource_record_name.indexOf('.')))"><IconClipboard :width="14" :height="14" /></a> Record Name</strong>
            <div>{{option.resource_record_name.slice(0, option.resource_record_name.indexOf('.'))}}</div>
          </div>
          <div class="mb-3">
            <strong><a href="javascript:;" @click="copy(option.resource_record_type)"><IconClipboard :width="14" :height="14" /></a> Type</strong>
            <div>{{option.resource_record_type}}</div>
          </div>
          <div class="mb-3">
            <strong><a href="javascript:;" @click="copy(option.resource_record_value.slice(0, -1))"><IconClipboard :width="14" :height="14" /></a> Value</strong>
            <div>{{option.resource_record_value.slice(0, -1)}}</div>
          </div>
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
      show_details: false
    }
  },
  computed: {
    regionName() {
      return regions[this.environment.region].name;
    },
    domainStatus() {
      return get(this.environment, 'last_success_deployment.output.domain_validation_status.value', null);
    },
    domainValidationOptions() {
      return get(this.environment, 'last_success_deployment.output.domain_validation_options.value', null);
    }
  },
  methods: {
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