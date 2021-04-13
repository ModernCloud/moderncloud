<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} Project</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body">
        <div v-if="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
        <form @submit.prevent="submit">
          <div>
            <label class="form-label">Name</label>
            <input type="text" class="form-control" v-model="form.name" />
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
import slugify from '@/lib/slugify';
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
        name: null
      }
    }
  },
  computed: {
    actionName() {
      return this.current_id > 0 ? 'Edit' : 'Create';
    }
  },
  watch: {
    'form.name'() {
      this.form.name = slugify(this.form.name);
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
      this.current_id = 0;
    },
    async loadItem(id) {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await axios.get(`/api/projects/${id}`);
        this.form.name = response.data.project.name;
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
      await axios.put(`/api/projects/${this.current_id}`, {...this.form});
      await this.$store.commit('loadProjects');
      this.closeModal();
    },
    async create() {
      await axios.post('/api/projects', {...this.form});
      await this.$store.commit('loadProjects');
      this.closeModal();
    }
  }
}
</script>