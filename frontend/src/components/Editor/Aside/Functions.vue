<template>
  <section class="accordion">
    <Confirm ref="confirmModal" message="Selected function will be deleted. Do you want to continue?" @yes="deleteItem" />
    <FunctionModal ref="modal" @added="added" @updated="updated" />
    <div class="section-title" @click="showContent=!showContent" :class="{active: showContent}">
      <IconFunction :width="18" :height="18" class="section-icon" />
      Functions
      <span v-if="loading" class="spinner-grow text-primary spinner-grow-sm" style="margin-left: 5px; width: 5px; height: 5px;" role="status" aria-hidden="true"></span>
      <div style="margin-left: auto; color: #90959D;">
        <IconChevronRight v-if="showContent === false" :width="20" :height="20" :stroke-width="1.5" />
        <IconChevronDown v-if="showContent" :width="20" :height="20" :stroke-width="1.5" />
      </div>
    </div>
    <transition name="slide">
      <div v-if="showContent" class="content">
        <div v-if="loading === false">
          <div class="search">
            <div><IconSearch :width="18" :height="18" /></div>
            <input type="text" placeholder="Search" v-model="search" />
            <a href="javascript:;" @click="search = null" v-if="search"><IconX :width="14" :height="14" /></a>
          </div>
          <div class="item new-link">
            <a href="javascript:;" class="link" @click="openNewModal"><IconSquarePlus :width="18" :height="18" /> New Function</a>
          </div>
          <div v-for="item in filteredItems" :key="item.id">
            <div :class="{item: true, active: isCurrentFile(item.id)}">
              <a href="javascript:;" @click="openFile(item.id)" class="link">
                <div class="item-name">{{item.user_name}}</div>
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
import Confirm from '@/components/Confirm.vue';
import {CodeEditorEvents} from '@/lib/code_editor_events';
import FunctionModal from './FunctionModal.vue';
import axios from "axios";
import IconSquarePlus from "@/components/Icons/IconSquarePlus";
import IconFunction from "@/components/Icons/IconFunction";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconChevronDown from "@/components/Icons/IconChevronDown";
import IconEdit from "@/components/Icons/IconEdit";
import IconDelete from "@/components/Icons/IconDelete";
import findIndex from "lodash/findIndex";
import IconSearch from "../../Icons/IconSearch";
import IconX from "../../Icons/IconX";

export default {
  components: {
    IconX,
    IconSearch,
    IconDelete,
    IconEdit,
    IconChevronDown,
    IconChevronRight,
    IconFunction,
    IconSquarePlus,
    Confirm,
    FunctionModal
  },
  data() {
    return {
      loading: false,
      showContent: this.$store.state.account.settings.accordion['functions'] ?? false,
      items: [],
      fileIsOpening: null,
      fileIsDeleting: null,
      search: null
    }
  },
  watch: {
    async '$store.state.project.selected'() {
      await this.loadItems();
    },
    showContent(newValue) {
      this.$store.commit('accordionStatus', {name: 'functions', status: newValue});
    }
  },
  computed: {
    filteredItems() {
      if (this.search == null) {
        return this.items;
      }
      let searchQuery = this.search.toLowerCase();
      return this.items.filter(item => {
        return item.user_name.toLowerCase().indexOf(searchQuery) > -1;
      });
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
          && this.$store.state.project.currentFile.type === 'function';
    },
    async openFile(id) {
      if (this.fileIsDeleting === id) {
        return;
      }
      this.fileIsOpening = id;
      try {
        let response = await axios.get('/api/functions/' + id);
        let file = {
          id: id,
          name: response.data.function.user_name,
          type: 'function',
          runtime: response.data.function.runtime,
          sourceCode: response.data.function.code,
          function_name: response.data.function.name,
          description: response.data.function.description
        }
        CodeEditorEvents.$emit('openFile', file);
      } catch (e) {
        console.log(e);
      } finally {
        this.fileIsOpening = null;
      }
    },
    async updateSourceCode(file) {
      if (file.type !== 'function') {
        return;
      }
      try {
        await axios.put('/api/functions/' + file.id + '/code', {
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
        CodeEditorEvents.$emit('closeFile', {id: selectedItem.id, type: 'function', sourceCode: null});
        await axios.delete('/api/functions/' + selectedItem.id);
        let index = findIndex(this.items, {id: selectedItem.id});
        this.items.splice(index, 1);
      } catch (e) {
        console.log(e);
      } finally {
        this.fileIsDeleting = null;
      }
    }
  }
}
</script>