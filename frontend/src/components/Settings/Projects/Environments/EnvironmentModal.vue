<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} Environment</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body">
        <div v-if="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
        <form @submit.prevent="submit">
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" v-model="form.name" />
          </div>
          <div class="mb-2">
            <label class="form-label">Region</label>
            <select class="form-select" v-model="form.region">
              <option v-for="region in regions" :key="region.region" :value="region.region">{{region.name}}</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">AWS Access Key</label>
            <input type="text" class="form-control" v-model="form.access_key" :disabled="isDeployed" />
          </div>
          <div class="mb-2">
            <label class="form-label">AWS Secret Key</label>
            <input type="text" class="form-control" v-model="form.secret_key" :disabled="isDeployed" />
          </div>
          <div class="form-text" v-if="isDeployed">Please destroy resources first to change AWS credentials.</div>
          <div class="form-text d-flex align-items-center"><IconFileText :stroke-width="1.5" :height="16" :width="16" style="margin-right: 3px;" /> <a href="https://www.moderncloud.io/docs/aws-credentials" target="_blank">How to get AWS Credentials?</a></div>
        </form>
      </div>
      <div class="actions">
        <button type="submit" class="btn btn-primary" @click="submit" :disabled="loading">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          {{actionName}}
        </button>
        <button type="button" class="btn" @click="closeModal" :disabled="loading">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import regions from '@/constants/regions';
import axios from "axios";
import IconX from "@/components/Icons/IconX";
import {getErrorMessage} from "../../../../lib/get_error_message";
import IconFileText from "../../../Icons/IconFileText";

export default {
  components: {IconFileText, IconX},
  data() {
    return {
      visible: false,
      errorMessage: null,
      loading: false,
      current_id: 0,
      regions: regions,
      isDeployed: false,
      form: {
        name: null,
        region: null,
        access_key: null,
        secret_key: null
      }
    }
  },
  computed: {
    actionName() {
      return this.current_id > 0 ? 'Edit' : 'Add';
    }
  },
  methods: {
    async showAdd() {
      this.current_id = 0;
      this.isDeployed = false;
      this.errorMessage = null;
      this.visible = true;
    },
    async showEdit(id) {
      this.visible = true;
      this.errorMessage = null;
      this.loading = true;
      this.isDeployed = false;
      this.current_id = id;
      await this.loadItem(id);
    },
    closeModal() {
      this.visible = false;
      this.errorMessage = null;
      this.isDeployed = false;
      this.form.name = null;
      this.form.region = 'us-east-1';
      this.form.access_key = null;
      this.form.secret_key = null;
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await axios.get(`/api/environments/${id}`);
        this.form.name = response.data.environment.name;
        this.form.region = response.data.environment.region;
        this.form.access_key = response.data.environment.access_key;
        this.form.secret_key = response.data.environment.secret_key;
        if (response.data.environment.api_gateway_id != null
          || response.data.environment.api_gateway_arn != null
          || response.data.environment.api_gateway_url != null) {
          this.isDeployed = true;
        }
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      this.loading = true;
      this.errorMessage = null;
      try {
        if (this.current_id > 0) {
          await this.update();
        } else {
          await this.create();
        }
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },
    async update() {
      await axios.put(`/api/environments/${this.current_id}`, {...this.form, project_id: this.$route.params.project_id || this.$store.state.project.selected.id});
      this.$emit('updated', this.current_id);
      this.closeModal();
    },
    async create() {
      let response = await axios.post('/api/environments', {...this.form, project_id: this.$route.params.project_id || this.$store.state.project.selected.id});
      this.$emit('added', response.data.id);
      this.closeModal();
    }
  }
}
</script>