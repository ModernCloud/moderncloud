<template>
  <div class="modal" v-if="visible">
    <notifications position="top center" />
    <div class="modal-wrapper" style="width: 700px;">
      <div class="header">
        <div class="title">Environment Variables</div>
        <a href="javascript:;" class="close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><path d="M10 10l4 4m0 -4l-4 4" /></svg>
        </a>
      </div>
      <div class="body" style="height: 350px; overflow-y: auto;">
        <div v-if="hasError" class="alert alert-danger">An error occurred!</div>
        <a href="javascript:;" @click="addNew" style="font-size: 13px; font-weight: 400;">New Variable</a>
        <table class="table table-hover" style="margin-top: 10px;">
          <thead>
            <tr>
              <th style="width: 30px;"></th>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(variable, index) in variables" :key="variable.id">
              <td valign="middle">
                <a href="javascript:;" @click="variables.splice(index, 1)"><IconDelete :width="16" :height="16" /></a>
              </td>
              <td>
                <input type="text" class="form-control" v-model="variable.name" tabindex="1" :disabled="loading" />
              </td>
              <td>
                <input type="text" class="form-control" v-model="variable.value" tabindex="1" :disabled="loading" />
              </td>
            </tr>
            <tr v-if="variables.length === 0">
              <td></td>
              <td colspan="2" class="text-muted">Empty</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="actions">
        <button type="submit" class="btn btn-primary" @click="save" :disabled="loading">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Save
        </button>
        <button type="button" class="btn" @click="closeModal" :disabled="loading">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import IconDelete from "@/components/Icons/IconDelete";

export default {
  components: {IconDelete},
  data() {
    return {
      visible: false,
      hasError: false,
      loading: false,
      current_id: 0,
      variables: []
    }
  },
  methods: {
    async show(id) {
      this.visible = !this.visible;
      this.loading = true;
      this.current_id = id;
      await this.loadVariables();
    },
    closeModal() {
      this.visible = !this.visible;
      this.variables = [];
      this.current_id = 0;
    },
    async loadVariables() {
      this.loading = true;
      try {
        let response = await axios.get(`/api/environments/${this.current_id}/variables`);
        this.variables = response.data.variables;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    addNew() {
      this.variables.push({id: 0, name: '', value: ''});
    },
    async save() {
      this.loading = true;
      try {
        await axios.put(`/api/environments/${this.current_id}/variables`, {
          variables: this.variables
        });
        this.$notify({
          title: 'Success',
          type: 'success',
          text: 'Variables have been saved!'
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>