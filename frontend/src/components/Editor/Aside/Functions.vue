<template>
  <section class="accordion">
    <Confirm ref="confirmModal" message="Selected function will be deleted. Do you want to continue?" @yes="deleteItem" />
    <FunctionModal ref="modal" @added="added" @updated="updated" />
    <div class="section-title" @click="showContent=!showContent" :class="{active: showContent}">
      <IconFunction :width="18" :height="18" />
      Functions
      <span v-if="loading" class="spinner-grow text-primary spinner-grow-sm" style="margin-left: 5px; width: 5px; height: 5px;" role="status" aria-hidden="true"></span>
      <div style="margin-left: auto">
        <IconChevronRight v-if="showContent === false" :width="12" :height="12" :stroke-width="2" />
        <IconChevronDown v-if="showContent" :width="12" :height="12" :stroke-width="2" />
      </div>
    </div>
    <transition name="slide">
      <div v-if="showContent" class="content">
        <div v-if="loading === false">
          <div class="item">
            <a href="javascript:;" @click="openNewModal"><IconSquarePlus :width="18" :height="18" /> New Function</a>
          </div>
          <div v-for="item in items" :key="item.id">
            <div class="item">
              <a href="javascript:;" @click="openFile(item.id)" :loading="item.id === fileIsOpening">
                <div class="item-name">{{item.name}}</div>
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

export default {
  components: {
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
      loading: true,
      showContent: false,
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
          name: response.data.function.name,
          type: 'function',
          sourceCode: response.data.function.code,
          function_name: response.data.function.name
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
    async deleteItem(selectedItem) {
      this.loading = true;
      try {
        await axios.delete('/api/functions/' + selectedItem.id);
        CodeEditorEvents.$emit('removeFile', {id: selectedItem.id, type: 'function', sourceCode: null});
      } catch (e) {
        console.log(e);
      } finally {
        await this.loadItems();
      }
    }
  }
}
</script>