<template>
  <sui-modal :open="visible">
    <sui-modal-header>{{actionName}} Environment</sui-modal-header>
    <sui-modal-content>
      <sui-form :loading="loading" @submit.prevent="submit" :error="hasError">
        <sui-message error>
          <p>An error occurred!</p>
        </sui-message>
        <sui-form-field>
          <label>Name</label>
          <input type="text" v-model="form.name" />
        </sui-form-field>
        <sui-form-field>
          <label>Region</label>
          <sui-dropdown
              fluid
              :options="Object.values(regions).map(item => {return {key: item.region, value: item.region, text: item.name};})"
              placeholder="Select Region"
              search
              selection
              v-model="form.region"
          />
        </sui-form-field>
        <sui-form-field>
          <label>AWS Access Key</label>
          <input type="text" v-model="form.access_key" />
        </sui-form-field>
        <sui-form-field>
          <label>AWS Secret Key</label>
          <input type="text" v-model="form.secret_key" />
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
import regions from '../../constants/regions';
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
      await axios.put(`/api/environments/${this.current_id}`, {...this.form, project_id: this.$store.state.project.selected.id});
      this.$emit('updated', this.current_id);
      this.closeModal();
    },
    async create() {
      let response = await axios.post('/api/environments', {...this.form, project_id: this.$store.state.project.selected.id});
      this.$emit('added', response.data.id);
      this.closeModal();
    }
  }
}
</script>