<template>
  <section class="accordion">
    <Confirm ref="confirmModal" message="Selected endpoint will be deleted. Do you want to continue?" @yes="deleteItem" />
    <EndpointModal ref="modal" @added="added" @updated="updated" />
    <div class="section-title" @click="showContent = !showContent" :class="{active: showContent}">
      <IconCircles :width="18" :height="18" class="section-icon" />
      Endpoints
      <span v-if="loading" class="spinner-grow text-primary spinner-grow-sm" style="margin-left: 5px; width: 5px; height: 5px;" role="status" aria-hidden="true"></span>
      <div style="margin-left: auto; color: #90959D;">
        <IconChevronRight v-if="showContent === false" :width="20" :height="20" :stroke-width="1.5" />
        <IconChevronDown v-if="showContent" :width="20" :height="20" :stroke-width="1.5" />
      </div>
    </div>
    <transition name="slide">
      <div v-if="showContent" class="content">
        <div v-if="loading === false">
          <div class="item new-link">
            <a href="javascript:;" class="link" @click="openNewModal"><IconSquarePlus :width="18" :height="18" /> New Endpoint</a>
          </div>
          <div v-for="item in items" :key="item.id">
            <div :class="{item: true, active: isCurrentFile(item.id)}">
              <a href="javascript:;" @click="openFile(item.id)" class="link">
                <div class="item-name">
                  {{item.user_name}}
                </div>
                <small :style="{'margin-left': '5px', color: methodLabelColor(item.method)}">{{item.method}}</small>
                <span v-if="item.id === fileIsOpening || item.id === fileIsDeleting" class="spinner-grow text-primary spinner-grow-sm" style="margin-left: 5px; width: 5px; height: 5px;" role="status" aria-hidden="true"></span>
              </a>
              <div class="action-menu">
                <a href="javascript:;" @click="openEditModal(item.id)">
                  <IconEdit :width="14" :height="14" :stroke-width="1" />
                </a>
                <a href="javascript:;" @click="$refs.confirmModal.show({id: item.id})">
                  <IconDelete :width="14" :height="14" :stroke-width="1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import {CodeEditorEvents} from '@/lib/code_editor_events';
import EndpointModal from './EndpointModal.vue';
import axios from "axios";
import Confirm from "@/components/Confirm.vue";
import IconSquarePlus from "@/components/Icons/IconSquarePlus";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconChevronDown from "@/components/Icons/IconChevronDown";
import IconCircles from "@/components/Icons/IconCircles";
import IconEdit from "@/components/Icons/IconEdit";
import IconDelete from "@/components/Icons/IconDelete";
import findIndex from "lodash/findIndex";

export default {
  components: {
    IconDelete,
    IconEdit,
    IconCircles,
    IconChevronDown,
    IconChevronRight,
    IconSquarePlus,
    Confirm,
    EndpointModal
  },
  data() {
    return {
      loading: false,
      showContent: this.$store.state.account.settings.accordion['endpoints'] ?? false,
      items: [],
      fileIsOpening: null,
      fileIsDeleting: null
    }
  },
  watch: {
    async '$store.state.project.selected'() {
      await this.loadItems();
    },
    showContent(newValue) {
      this.$store.commit('accordionStatus', {name: 'endpoints', status: newValue});
    }
  },
  async mounted() {
    if (this.$store.state.project.selected != null && this.loading === false) {
      await this.loadItems();
    }
    CodeEditorEvents.$on('sourceCodeUpdated', this.updateSourceCode);
  },
  destroyed() {
    CodeEditorEvents.$off('sourceCodeUpdated');
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
    async added(id) {
      await this.loadItems();
      await this.openFile(id);
    },
    async updated(id) {
      await this.loadItems();
      await this.openFile(id);
    },
    isCurrentFile(fileId) {
      return this.$store.state.project.currentFile.id === fileId
          && this.$store.state.project.currentFile.type === 'endpoint';
    },
    async openFile(id) {
      if (this.fileIsDeleting === id) {
        return;
      }
      this.fileIsOpening = id;
      try {
        let response = await axios.get('/api/endpoints/' + id);
        let file = {
          id: id,
          type: 'endpoint',
          name: response.data.endpoint.user_name,
          runtime: response.data.endpoint.runtime,
          method: response.data.endpoint.method,
          sourceCode: response.data.endpoint.code,
          function_name: response.data.endpoint.name,
          path: response.data.endpoint.path,
          description: response.data.endpoint.description
        }
        CodeEditorEvents.$emit('openFile', file);
      } catch (e) {
        console.log(e);
      } finally {
        this.fileIsOpening = null;
      }
    },
    async updateSourceCode(file) {
      if (file.type !== 'endpoint') {
        return;
      }
      try {
        await axios.put('/api/endpoints/' + file.id + '/code', {
          project_id: this.$store.state.project.selected.id,
          code: file.sourceCode
        });
      } catch (e) {
        console.log(e);
      }
    },
    async deleteItem(selectedItem) {
      this.fileIsDeleting = selectedItem.id;
      try {
        CodeEditorEvents.$emit('closeFile', {id: selectedItem.id, type: 'endpoint', sourceCode: null});
        await axios.delete('/api/endpoints/' + selectedItem.id);
        let index = findIndex(this.items, {id: selectedItem.id});
        this.items.splice(index, 1);
      } catch (e) {
        console.log(e);
      } finally {
        this.fileIsDeleting = null;
      }
    },
    methodLabelColor(method) {
      if (method === 'POST') {
        return '#f77f00';
      } else if (method === 'DELETE') {
        return '#d62828';
      } else if (method === 'PUT') {
        return '#0077b6';
      } else {
        return '#55a630';
      }
    }
  }
}
</script>