<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} DynamoDB Table</div>
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
          <div class="mb-2 row">
            <div class="col">
              <label class="form-label">Read Capacity</label>
              <input type="number" min="1" class="form-control" v-model="form.read_capacity" />
            </div>
            <div class="col">
              <label class="form-label">Write Capacity</label>
              <input type="number" min="1" class="form-control" v-model="form.write_capacity" />
            </div>
          </div>
          <div class="mb-2 row">
            <div class="col">
              <label class="form-label">Hash Key</label>
              <input type="text" class="form-control" v-model="form.hash_key" />
            </div>
            <div class="col">
              <label class="form-label">Range Key</label>
              <input type="text" class="form-control" v-model="form.range_key" />
            </div>
          </div>
          <div class="mb-2">
            <a style="font-size: 13px; font-weight: 400;" href="javascript:;" @click="form.attributes.push({name: '', type: 'S'})">New Attribute</a>
          </div>
          <table class="table table-hover table-bordered mb-2">
            <thead>
              <tr>
                <th style="width: 30px;"></th>
                <th>Attribute Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(attribute, index) in form.attributes" :key="index">
                <td style="vertical-align: middle">
                  <a href="javascript:;" @click="form.attributes.splice(index, 1)">Remove</a>
                </td>
                <td>
                  <input type="text" class="form-control" v-model="form.attributes[index].name" />
                </td>
                <td>
                  <select class="form-select" v-model="form.attributes[index].type">
                    <option value="S">String</option>
                    <option value="N">Number</option>
                    <option value="B">Binary</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
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

export default {
  data() {
    return {
      visible: false,
      hasError: false,
      loading: false,
      current_id: 0,
      form: {
        name: '',
        read_capacity: 1,
        write_capacity: 1,
        hash_key: null,
        range_key: null,
        attributes: []
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
      this.form.name = '';
      this.form.read_capacity = 1;
      this.form.write_capacity = 1;
      this.form.hash_key = null;
      this.form.range_key = null;
      this.form.attributes = [];
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      try {
        let response = await axios.get(`/api/dynamodb/${id}`);
        this.form.name = response.data.table.name;
        this.form.read_capacity = response.data.table.read_capacity;
        this.form.write_capacity = response.data.table.write_capacity;
        this.form.hash_key = response.data.table.hash_key;
        this.form.range_key = response.data.table.range_key;
        this.form.attributes = JSON.parse(response.data.table.attributes || []);
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
      await axios.put(`/api/dynamodb/${this.current_id}`, {...this.form, project_id: this.$store.state.project.selected.id});
      this.$emit('updated', this.current_id);
      this.closeModal();
    },
    async create() {
      let response = await axios.post('/api/dynamodb', {
        ...this.form,
        project_id: this.$store.state.project.selected.id
      });
      this.$emit('added', response.data.id);
      this.closeModal();
    }
  }
}
</script>