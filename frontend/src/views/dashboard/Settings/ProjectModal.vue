<template>
  <sui-modal :open="visible">
    <sui-modal-header>{{actionName}} Project</sui-modal-header>
    <sui-modal-content>
      <sui-form :loading="loading" @submit.prevent="submit" :error="hasError">
        <sui-message error>
          <p>An error occurred!</p>
        </sui-message>
        <sui-form-field>
          <label>Name</label>
          <input type="text" v-model="form.name" />
        </sui-form-field>
      </sui-form>
    </sui-modal-content>
    <sui-modal-actions>
      <sui-button basic @click="closeModal">Cancel</sui-button>
      <sui-button positive @click="submit">{{actionName}}</sui-button>
    </sui-modal-actions>
  </sui-modal>
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
        name: ''
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
      this.form.name = '';
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      try {
        let response = await axios.get(`/api/projects/${id}`);
        this.form.name = response.data.project.name;
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
      await axios.put(`/api/projects/${this.current_id}`, {...this.form});
      await this.$store.commit('loadProjects');
      await this.$store.commit('clearSelectedProject');
      this.closeModal();
    },
    async create() {
      await axios.post('/api/projects', {...this.form});
      await this.$store.commit('loadProjects');
      await this.$store.commit('clearSelectedProject');
      this.closeModal();
    }
  }
}
</script>