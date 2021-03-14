<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} Environment</div>
        <a href="javascript:;" class="close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><path d="M10 10l4 4m0 -4l-4 4" /></svg>
        </a>
      </div>
      <div class="body">
        <div v-if="hasError" class="alert alert-danger">An error occurred!</div>
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
            <input type="text" class="form-control" v-model="form.access_key" />
          </div>
          <div class="mb-2">
            <label class="form-label">AWS Secret Key</label>
            <input type="text" class="form-control" v-model="form.secret_key" />
          </div>
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
import regions from '../../../constants/regions';
import axios from "axios";

export default {
  data() {
    return {
      visible: false,
      hasError: false,
      loading: false,
      current_id: 0,
      regions: regions,
      form: {
        name: '',
        region: '',
        access_key: '',
        secret_key: ''
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
      this.visible = !this.visible;
    },
    async showEdit(id) {
      this.visible = !this.visible;
      this.loading = true;
      this.current_id = id;
      await this.loadItem(id);
    },
    closeModal() {
      this.visible = !this.visible;
      this.form.name = '';
      this.form.region = 'us-east-1';
      this.form.access_key = '';
      this.form.secret_key = '';
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      try {
        let response = await axios.get(`/api/environments/${id}`);
        this.form.name = response.data.environment.name;
        this.form.region = response.data.environment.region;
        this.form.access_key = response.data.environment.access_key;
        this.form.secret_key = response.data.environment.secret_key;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      this.loading = true;
      try {
        if (this.current_id > 0) {
          await this.update();
        } else {
          await this.create();
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async update() {
      await axios.put(`/api/environments/${this.current_id}`, {...this.form, project_id: this.$route.params.project_id});
      this.$emit('updated', this.current_id);
      this.closeModal();
    },
    async create() {
      let response = await axios.post('/api/environments', {...this.form, project_id: this.$route.params.project_id});
      this.$emit('added', response.data.id);
      this.closeModal();
    }
  }
}
</script>