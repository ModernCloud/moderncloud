<template>
  <div class="modal" v-if="visible">
    <notifications position="top center" />
    <div class="modal-wrapper" style="width: 700px;">
      <div class="header">
        <div class="title">Environment Variables</div>
        <a href="javascript:;" class="close" @click="closeModal"><IconX :width="18" :height="18" :stroke-width="1.5" /></a>
      </div>
      <div class="body" style="height: 350px; overflow-y: auto;">
        <div v-if="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
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
import IconX from "@/components/Icons/IconX";
import {getErrorMessage} from "../../../../lib/get_error_message";

export default {
  components: {IconX, IconDelete},
  data() {
    return {
      visible: false,
      errorMessage: null,
      loading: false,
      current_id: 0,
      variables: []
    }
  },
  methods: {
    async show(id) {
      this.visible = !this.visible;
      this.errorMessage = null;
      this.loading = true;
      this.current_id = id;
      await this.loadVariables();
    },
    closeModal() {
      this.visible = !this.visible;
      this.errorMessage = null;
      this.variables = [];
      this.current_id = 0;
    },
    async loadVariables() {
      this.loading = true;
      this.errorMessage = null;
      try {
        let response = await axios.get(`/api/environments/${this.current_id}/variables`);
        this.variables = response.data.variables;
      } catch (e) {
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },
    addNew() {
      this.variables.push({id: 0, name: '', value: ''});
    },
    async save() {
      this.loading = true;
      this.errorMessage = null;
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
        this.errorMessage = getErrorMessage(e);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>