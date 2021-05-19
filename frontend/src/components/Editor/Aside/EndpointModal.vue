<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} Endpoint</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body">
        <div v-if="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
        <form @submit.prevent="submit">
          <div class="mb-2">
            <label class="form-label">Name</label>
            <div class="d-flex">
              <select class="form-select" v-model="form.runtime" style="width: 140px; margin-right: 5px;">
                <option value="python3.8" :selected="form.runtime === 'python3.8'">Python 3.8</option>
                <option value="nodejs14.x" :selected="form.runtime === 'nodejs14.x'">Node.js 14</option>
              </select>
              <input type="text" class="form-control" v-model="form.user_name" placeholder="My Endpoint" />
            </div>
          </div>
          <div class="mb-2">
            <label class="form-label">Path</label>
            <div class="d-flex">
              <select class="form-select" v-model="form.method" style="width: 140px; margin-right: 5px;">
                <option value="POST" :selected="form.method === 'POST'">POST</option>
                <option value="GET" :selected="form.method === 'GET'">GET</option>
                <option value="DELETE" :selected="form.method === 'DELETE'">DELETE</option>
                <option value="PUT" :selected="form.method === 'PUT'">PUT</option>
              </select>
              <input type="text" class="form-control" v-model="form.path" placeholder="/my-endpoint" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="mb-2">
                <label class="form-label">Memory Size (MB)</label>
                <input type="number" class="form-control" min="128" max="10240" v-model="form.memory_size" />
              </div>
            </div>
            <div class="col">
              <div class="mb-2">
                <label class="form-label">Timeout (seconds)</label>
                <input type="number" class="form-control" min="3" max="900" v-model="form.timeout" />
              </div>
            </div>
          </div>
          <div>
            <label class="form-label">Description</label>
            <textarea v-model="form.description" class="form-control"></textarea>
          </div>
        </form>
      </div>
      <div class="actions">
        <button type="submit" class="btn btn-primary" @click="submit" :disabled="loading">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          {{actionName}}
        </button>
        <button type="button" class="btn" @click="closeModal" :disabled="loading">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import IconX from "@/components/Icons/IconX";
import {getErrorMessage} from "../../../lib/get_error_message";

export default {
  components: {IconX},
  data() {
    return {
      visible: false,
      errorMessage: null,
      loading: false,
      current_id: 0,
      form: {
        user_name: null,
        runtime: 'nodejs14.x',
        method: 'POST',
        path: '/',
        description: null,
        memory_size: 128,
        timeout: 3
      }
    }
  },
  computed: {
    actionName() {
      return this.current_id > 0 ? 'Edit' : 'Create';
    }
  },
  methods: {
    async showAdd() {
      this.current_id = 0;
      this.errorMessage = null;
      this.visible = true;
    },
    async showEdit(id) {
      this.errorMessage = null;
      this.visible = true;
      this.loading = true;
      this.current_id = id;
      await this.loadItem(id);
    },
    closeModal() {
      this.visible = false;
      this.errorMessage = null;
      this.form.user_name = null;
      this.form.method = 'POST';
      this.form.path = '/';
      this.form.description = null;
      this.form.memory_size = 128;
      this.form.timeout = 3;
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await axios.get(`/api/endpoints/${id}`);
        this.form.user_name = response.data.endpoint.user_name;
        this.form.method = response.data.endpoint.method;
        this.form.runtime = response.data.endpoint.runtime;
        this.form.path = response.data.endpoint.path;
        this.form.description = response.data.endpoint.description;
        this.form.memory_size = response.data.endpoint.memory_size;
        this.form.timeout = response.data.endpoint.timeout;
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
      await axios.put(`/api/endpoints/${this.current_id}`, {...this.form, project_id: this.$store.state.project.selected.id});
      this.$emit('updated', this.current_id);
      this.closeModal();
    },
    async create() {
      let response = await axios.post('/api/endpoints', {...this.form, project_id: this.$store.state.project.selected.id});
      this.$emit('added', response.data.id);
      this.closeModal();
    }
  }
}
</script>