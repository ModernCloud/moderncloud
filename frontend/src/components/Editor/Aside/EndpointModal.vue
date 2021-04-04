<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} Endpoint</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body">
        <div v-if="hasError" class="alert alert-danger">An error occurred!</div>
        <form @submit.prevent="submit">
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" v-model="form.user_name" placeholder="My Endpoint" />
          </div>
          <div class="mb-2">
            <label class="form-label">Method</label>
            <select class="form-select" v-model="form.method">
              <option value="POST" :selected="form.method === 'POST'">POST</option>
              <option value="GET" :selected="form.method === 'GET'">GET</option>
              <option value="DELETE" :selected="form.method === 'DELETE'">DELETE</option>
              <option value="PUT" :selected="form.method === 'PUT'">PUT</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">Path</label>
            <input type="text" class="form-control" v-model="form.path" placeholder="/my-endpoint" />
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

export default {
  components: {IconX},
  data() {
    return {
      visible: false,
      hasError: false,
      loading: false,
      current_id: 0,
      form: {
        user_name: '',
        method: 'POST',
        path: '/',
        description: ''
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
      this.hasError = false;
      this.form.user_name = '';
      this.form.method = 'POST';
      this.form.path = '/';
      this.form.description = '';
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      try {
        let response = await axios.get(`/api/endpoints/${id}`);
        this.form.user_name = response.data.endpoint.user_name;
        this.form.method = response.data.endpoint.method;
        this.form.path = response.data.endpoint.path;
        this.form.description = response.data.endpoint.description;
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
        this.hasError = true;
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