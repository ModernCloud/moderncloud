<template>
  <div class="modal" v-if="visible">
    <div class="modal-wrapper">
      <div class="header">
        <div class="title">{{actionName}} Package</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body" style="overflow: unset; max-height: unset;">
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <form @submit.prevent="submit">
          <div class="mb-2">
            <label class="form-label">Name</label>
            <v-select @search="searchPackage" v-model="selected" :options="searchResult">
              <template slot="no-options">
                type to search packages
              </template>
              <template slot="option" slot-scope="option">
                <div style="display: flex; align-items: center; padding: 5px 0;">
                  <div style="overflow: hidden; width: 350px;">
                    <strong>{{ option.label }}</strong>
                    <p>{{ option.description }}</p>
                  </div>
                  <div style="margin-left: auto">{{ option.version }}</div>
                </div>
              </template>
              <template slot="selected-option" slot-scope="option">
                <div class="selected">
                  {{ option.label }}
                </div>
              </template>
            </v-select>
          </div>
          <div>
            <label class="form-label">Version</label>
            <input type="text" class="form-control" v-model="form.version" />
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
import {CodeEditorEvents} from '@/lib/code_editor_events';
import axios from "axios";
import IconX from "@/components/Icons/IconX";
import VSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import {getErrorMessage} from "../../../lib/get_error_message";

export default {
  components: {IconX,VSelect},
  data() {
    return {
      visible: false,
      errorMessage: null,
      loading: false,
      current_id: 0,
      searchTimeout: null,
      searchResult: [],
      selected: null,
      form: {
        name: null,
        version: null
      }
    }
  },
  computed: {
    actionName() {
      return this.current_id > 0 ? 'Edit' : 'Add';
    }
  },
  watch: {
    selected() {
      if (this.selected != null) {
        this.form.name = this.selected.label;
        this.form.version = this.selected.version;
      }
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
      this.form.version = null;
      this.current_id = 0;
      this.selected = null;
      this.searchResult = [];
    },
    async loadItem(id) {
      this.loading = true;
      try {
        let response = await axios.get(`/api/packages/${id}`);
        this.form.name = response.data.package.name;
        this.form.version = response.data.package.version;
        if (this.form.name) {
          this.selected = {
            label: this.form.name,
            version: this.form.version
          };
        }
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
      await axios.put(`/api/packages/${this.current_id}`, {...this.form, project_id: this.$store.state.project.selected.id});
      this.$emit('updated', this.current_id);
      this.closeModal();
    },
    async create() {
      let response = await axios.post('/api/packages', {...this.form, project_id: this.$store.state.project.selected.id});
      this.$emit('added', response.data.id);
      CodeEditorEvents.$emit('addPackage', this.form.name, this.form.version);
      this.closeModal();
    },
    searchPackage(search, loading) {
      if (search == null || search.length === 0) {
        return;
      }
      loading(true);
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      let that = this;
      this.searchTimeout = setTimeout(function () {
        axios.get(`/api/packages/search-npms?q=${escape(search)}&size=10`)
          .then(response => {
            loading(false);
            that.searchResult = response.data.results.map(item => {
              return {label: item.package.name, version: item.package.version, description: item.package.description}
            });
          });
      }, 400);
    }
  }
}
</script>