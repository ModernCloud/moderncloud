<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} DynamoDB Table</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <perfect-scrollbar class="body" :options="{suppressScrollX: true}">
        <div v-if="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
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
              <label class="form-label">Hash Key <span style="font-weight: 300; font-size: 10px;">(required)</span></label>
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
          <table class="table table-hover table-bordered mb-2" v-if="form.attributes.length > 0">
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
                  <a href="javascript:;" @click="form.attributes.splice(index, 1)">
                    <IconDelete :width="18" :height="18" />
                  </a>
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
      </perfect-scrollbar>
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
import {getErrorMessage} from "@/lib/get_error_message";
import IconDelete from "@/components/Icons/IconDelete";

export default {
  components: {IconDelete, IconX},
  data() {
    return {
      visible: false,
      errorMessage: null,
      loading: false,
      current_id: 0,
      form: {
        name: null,
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
      this.errorMessage = null;
      this.visible = !this.visible;
    },
    async showEdit(id) {
      this.visible = !this.visible;
      this.errorMessage = null;
      this.loading = true;
      this.current_id = id;
      await this.loadItem(id);
    },
    closeModal() {
      this.visible = !this.visible;
      this.errorMessage = null;
      this.form.name = null;
      this.form.read_capacity = 1;
      this.form.write_capacity = 1;
      this.form.hash_key = null;
      this.form.range_key = null;
      this.form.attributes = [];
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await axios.get(`/api/dynamodb/${id}`);
        this.form.name = response.data.table.name;
        this.form.read_capacity = response.data.table.read_capacity;
        this.form.write_capacity = response.data.table.write_capacity;
        this.form.hash_key = response.data.table.hash_key;
        this.form.range_key = response.data.table.range_key;
        this.form.attributes = JSON.parse(response.data.table.attributes || []);
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
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
        this.errorMessage = getErrorMessage(e);
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