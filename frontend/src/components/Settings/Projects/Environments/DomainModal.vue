<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper" style="width: 700px">
      <div class="header">
        <div class="title">Custom Domain</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body" style="max-height: 350px; overflow-y: auto;">
        <div class="steps">
          <div class="step" :class="{active: step === 1}">
            <div class="number">Step 1</div>
            <div class="name">Set Domain</div>
          </div>
          <div class="step" :class="{active: step === 2}">
            <div class="number">Step 2</div>
            <div class="name">Verify Ownership</div>
          </div>
          <div class="step" :class="{active: step === 3}">
            <div class="number">Step 3</div>
            <div class="name">Completed</div>
          </div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
        <div v-if="step === 1">
          <form @submit.prevent="submit">
            <div class="mb-2">
              <label class="form-label">Domain Name</label>
              <input type="text" class="form-control" v-model="form.domain_name" />
            </div>
          </form>
        </div>
        <div v-if="step === 2">
          <div style="font-size: 11px; word-wrap: break-word; padding: 20px; border-radius: 5px; background: rgba(0, 0, 0, .05); color: #555;">
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
        </div>
        <div v-if="step === 3">
          <div style="font-size: 11px; word-wrap: break-word; padding: 20px; border-radius: 5px; background: rgba(0, 0, 0, .05); color: #555;">
            <p>Add the following CNAME record to the DNS configuration for your domain. The procedure for adding CNAME records depends on your DNS service Provider.</p>
            <div class="mb-3">
              <strong><a href="javascript:;" @click="copy(environment.domain_name)"><IconClipboard :width="14" :height="14" /></a> Record Name</strong>
              <div>{{environment.domain_name}}</div>
            </div>
            <div class="mb-3">
              <strong><a href="javascript:;" @click="copy('CNAME')"><IconClipboard :width="14" :height="14" /></a> Type</strong>
              <div>CNAME</div>
            </div>
            <div class="mb-3">
              <strong><a href="javascript:;" @click="copy(environment.cloudfront_domain_name)"><IconClipboard :width="14" :height="14" /></a> Value</strong>
              <div>{{environment.cloudfront_domain_name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <button type="submit" class="btn btn-primary" @click="next" :disabled="loading" v-if="step < 3">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Next
        </button>
        <button type="submit" class="btn btn-primary bg-danger" @click="deleteDomain" :disabled="loading" v-if="step > 1">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Delete Domain
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import IconX from "@/components/Icons/IconX";
import get from "lodash/get";
import IconClipboard from "@/components/Icons/IconClipboard";
import {getErrorMessage} from "../../../../lib/get_error_message";

export default {
  components: {IconClipboard, IconX},
  data() {
    return {
      step: 0,
      visible: false,
      errorMessage: null,
      loading: false,
      current_id: 0,
      environment: null,
      form: {
        domain_name: null
      }
    }
  },
  computed: {
    hasCertificate() {
      return get(this.environment, 'certificate_arn') != null;
    },
    domainStatus() {
      return get(this.environment.certificate_validation_options, 'ValidationStatus', 'PENDING_VALIDATION');
    },
    resourceRecord() {
      return get(this.environment.certificate_validation_options, 'ResourceRecord', {});
    }
  },
  methods: {
    async showAdd(id) {
      this.errorMessage = null;
      this.current_id = id;
      this.visible = !this.visible;
      await this.loadItem(id);
    },
    closeModal() {
      this.visible = !this.visible;
      this.errorMessage = null;
      this.form.domain_name = null;
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await axios.get(`/api/environments/${id}`);
        this.environment = response.data.environment;
        this.environment.certificate_validation_options = JSON.parse(this.environment.certificate_validation_options || '{}');
        if (this.environment.domain_name == null) {
          this.step = 1;
        } else if (this.environment.cloudfront_domain_name == null) {
          this.step = 2;
        } else {
          this.step = 3;
        }
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },
    next() {
      if (this.step === 1) {
        this.setDomain();
      } else if (this.step === 2) {
        this.attachDomain();
      }
    },
    async setDomain() {
      this.loading = true;
      this.errorMessage = null;
      try {
        await axios.post(`/api/environments/${this.current_id}/set-domain`, {...this.form});
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
        await this.loadItem(this.current_id);
      }
    },
    async attachDomain() {
      this.loading = true;
      this.errorMessage = null;
      try {
        await axios.post(`/api/environments/${this.current_id}/attach-domain`);
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
        await this.loadItem(this.current_id);
      }
    },
    async deleteDomain() {
      this.loading = true;
      this.errorMessage = null;
      try {
        await axios.post('/api/environments/' + this.current_id + '/delete-domain');
        this.closeModal();
        this.$notify({
          title: 'Success',
          type: 'success',
          text: 'Custom domain has been deleted!'
        });
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
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
  }
}
</script>