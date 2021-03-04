<template>
  <div>
    <EndpointModal ref="modal" @added="added" @updated="updated" />
    <sui-accordion-title is="sui-menu-header" active>
      <sui-icon name="dropdown" />
      Endpoints
    </sui-accordion-title>
    <sui-accordion-content active style="font-size: 12px; padding-left: 10px;">
      <div style="margin-bottom: 10px;"><a href="javascript:;" @click="openNewModal"><sui-icon name="plus square" outline /> New Endpoint</a></div>
      <sui-icon name="spinner" loading v-if="loading" />
      <div v-if="loading === false">
        <div style="display: flex; align-items: center; margin-bottom: 4px; font-size: 11px;" v-for="item in items" :key="item.id">
          <sui-button size="mini" basic style="flex-grow: 1; text-align: left" @click="openFile(item.id)" :loading="item.id === fileIsOpening" :active="currentFile.id === item.id && currentFile.type === 'endpoint'">
            <sui-label size="mini" style="width: 50px; margin-right: 2px;" :color="methodLabelColor(item.method)">{{item.method}}</sui-label> {{item.path}}
          </sui-button>
          <sui-dropdown icon="ellipsis vertical" pointing="right top">
            <sui-dropdown-menu style="right: 0;left: auto;">
              <sui-dropdown-item @click="openEditModal(item.id)">Edit</sui-dropdown-item>
              <sui-dropdown-item @click="deleteItem(item.id)">Delete</sui-dropdown-item>
            </sui-dropdown-menu>
          </sui-dropdown>
        </div>
      </div>
    </sui-accordion-content>
  </div>
</template>

<script>
import {CodeEditorEvents} from './code_editor_events';
import EndpointModal from './EndpointModal.vue';
import axios from "axios";

export default {
  components: {
    EndpointModal
  },
  data() {
    return {
      loading: true,
      items: [],
      fileIsOpening: null,
      currentFile: {
        id: null,
        type: null,
        sourceCode: null
      }
    }
  },
  watch: {
    '$store.state.project.selected'() {
      this.loadItems();
    }
  },
  mounted() {
    this.loadItems();
    CodeEditorEvents.$on('fileChanged', this.fileChanged);
    CodeEditorEvents.$on('openFile', file => {
      this.currentFile = file;
    });
  },
  destroyed() {
    CodeEditorEvents.$off('fileChanged');
    CodeEditorEvents.$off('openFile');
  },
  methods: {
    async loadItems() {
      this.loading = true;
      try {
        let response = await axios.get('/api/endpoints',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.items = response.data.endpoints;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    openNewModal() {
      this.$refs.modal.showAdd();
    },
    openEditModal(id) {
      this.$refs.modal.showEdit(id);
    },
    added(id) {
      this.loadItems();
      this.openFile(id);
    },
    updated() {
      this.loadItems();
    },
    async openFile(id) {
      this.fileIsOpening = id;
      try {
        let response = await axios.get('/api/endpoints/' + id);
        let file = {
          id: id,
          type: 'endpoint',
          sourceCode: response.data.endpoint.code
        }
        CodeEditorEvents.$emit('openFile', file);
      } catch (e) {
        console.log(e);
      } finally {
        this.fileIsOpening = null;
      }
    },
    async fileChanged(file) {
      if (file.type !== 'endpoint') {
        return;
      }
      try {
        await axios.put('/api/endpoints/' + file.id, {
          project_id: this.$store.state.project.selected.id,
          code: file.sourceCode
        });
      } catch (e) {
        console.log(e);
      }
    },
    async deleteItem(id) {
      if (confirm('Are you sure?') === false) {
        return;
      }
      this.loading = true;
      try {
        await axios.delete('/api/endpoints/' + id);
        CodeEditorEvents.$emit('removeFile', {id: id, type: 'endpoint', sourceCode: null});
      } catch (e) {
        console.log(e);
      } finally {
        await this.loadItems();
      }
    },
    methodLabelColor(method) {
      if (method === 'POST') {
        return 'green';
      } else if (method === 'DELETE') {
        return 'red';
      } else if (method === 'PUT') {
        return 'yellow';
      } else {
        return 'blue';
      }
    }
  }
}
</script>