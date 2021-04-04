<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">Add Domain</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body">
        <div v-if="hasError" class="alert alert-danger">An error occurred!</div>
        <form @submit.prevent="submit">
          <div class="mb-2">
            <label class="form-label">Domain Name</label>
            <input type="text" class="form-control" v-model="form.domain_name" />
          </div>
        </form>
      </div>
      <div class="actions">
        <button type="submit" class="btn btn-primary" @click="submit" :disabled="loading">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Add
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

export default {
  components: {IconX},
  data() {
    return {
      visible: false,
      hasError: false,
      loading: false,
      current_id: 0,
      regions: regions,
      form: {
        domain_name: ''
      }
    }
  },
  methods: {
    async showAdd(id) {
      this.current_id = id;
      this.visible = !this.visible;
      await this.loadItem(id);
    },
    closeModal() {
      this.visible = !this.visible;
      this.form.domain_name = '';
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      try {
        let response = await axios.get(`/api/environments/${id}`);
        this.form.domain_name = response.data.environment.domain_name;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      this.loading = true;
      try {
        await axios.post(`/api/environments/${this.current_id}/add-domain`, {...this.form});
        this.$emit('added');
        this.closeModal();
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
  }
}
</script>