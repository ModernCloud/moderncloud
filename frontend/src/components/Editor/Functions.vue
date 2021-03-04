<template>
  <div>
    <FunctionModal ref="modal" @added="added" @updated="updated" />
    <sui-accordion-title is="sui-menu-header">
      <sui-icon name="dropdown" />
      Functions
    </sui-accordion-title>
    <sui-accordion-content style="font-size: 12px; padding-left: 10px;">
      <div style="margin-bottom: 10px;"><a href="javascript:;" @click="openNewModal"><sui-icon name="plus square" outline /> New Function</a></div>
      <sui-icon name="spinner" loading v-if="loading" />
      <div v-if="loading === false">
        <div style="display: flex; align-items: center; margin-bottom: 4px; font-size: 11px;" v-for="item in items" :key="item.id">
          <sui-button size="mini" basic style="flex-grow: 1; text-align: left" :loading="item.id === fileIsOpening" @click="openFile(item.id)" :active="currentFile.id === item.id && currentFile.type === 'function'">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 10h1c1 0 1 1 2.016 3.527c.984 2.473 .984 3.473 1.984 3.473h1" /><path d="M13 17c1.5 0 3 -2 4 -3.5s2.5 -3.5 4 -3.5" /><path d="M3 19c0 1.5 .5 2 2 2s2 -4 3 -9s1.5 -9 3 -9s2 .5 2 2" /><line x1="5" y1="12" x2="11" y2="12" /></svg>
            {{item.name}}
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
import FunctionModal from './FunctionModal.vue';
import axios from "axios";

export default {
  components: {
    FunctionModal
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
        let response = await axios.get('/api/functions',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.items = response.data.functions;
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
        let response = await axios.get('/api/functions/' + id);
        let file = {
          id: id,
          type: 'function',
          sourceCode: response.data.function.code
        }
        CodeEditorEvents.$emit('openFile', file);
      } catch (e) {
        console.log(e);
      } finally {
        this.fileIsOpening = null;
      }
    },
    async fileChanged(file) {
      if (file.type !== 'function') {
        return;
      }
      try {
        await axios.put('/api/functions/' + file.id, {
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
        await axios.delete('/api/functions/' + id);
        CodeEditorEvents.$emit('removeFile', {id: id, type: 'function', sourceCode: null});
      } catch (e) {
        console.log(e);
      } finally {
        await this.loadItems();
      }
    }
  }
}
</script>