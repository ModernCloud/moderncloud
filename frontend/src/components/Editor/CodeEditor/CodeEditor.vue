<template>
  <div role="main" id="code-editor">
    <div class="empty-state" v-if="$store.state.project.files.length === 0">
      <div>
        <h2>Welcome Back {{$store.state.account.user.name}}</h2>
        <p>Create your endpoints and functions in minutes with ModernCloud.</p>
      </div>
    </div>
    <div class="code-state" v-if="$store.state.project.files.length > 0">
      <div class="code-area">
        <div class="tools">
          <a href="javascript:;" @click.prevent="scrollLeft()" class="button-scroll-left" :class="{disabled: disableLeftScrollButton}">
            <IconChevronLeft :stroke-width="1.7" :width="18" :height="18" />
          </a>
          <div class="files">
            <div class="file" :class="{open: item.id === $store.state.project.currentFile.id && item.type === $store.state.project.currentFile.type}" v-for="item in $store.state.project.files" :key="item.type + '_' + item.id">
              <div class="name" @click.prevent="openFile(item)">
                <small v-if="item.type === 'endpoint'" :style="{
                'display': 'inline-block',
                'font-weight': 600,
                'margin-right': '2px',
                'color': methodLabelColor(item.method),
                'font-size': '9px'
              }">{{item.method}}</small>
                <IconFunction :width="12" :height="12" :stroke-width="2" v-if="item.type === 'function'" />
                {{item.name}}
              </div>
              <div class="action" @click.prevent="closeFile(item)">
                <div class="icon">
                  <IconX :width="12" :height="12" :stroke-width="2" />
                </div>
              </div>
            </div>
          </div>
          <a href="javascript:;" @click.prevent="scrollRight()" class="button-scroll-right" :class="{disabled: disableRightScrollButton}">
            <IconChevronRight :stroke-width="1.7" :width="18" :height="18" />
          </a>
        </div>
        <monaco-editor ref="monaco" class="monaco-editor"></monaco-editor>
      </div>
      <InfoPanel :file="$store.state.project.currentFile" />
    </div>
  </div>
</template>

<script>
import {CodeEditorEvents} from '@/lib/code_editor_events';
import MonacoEditor from './MonacoEditor.vue';
import InfoPanel from './InfoPanel.vue';
import IconChevronLeft from "@/components/Icons/IconChevronLeft";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconFunction from "@/components/Icons/IconFunction";
import IconX from "@/components/Icons/IconX";
import findIndex from "lodash/findIndex";

export default {
  components: {
    MonacoEditor,
    InfoPanel,
    IconX,
    IconFunction,
    IconChevronRight,
    IconChevronLeft,
  },
  data() {
    return {
      disableLeftScrollButton: true,
      disableRightScrollButton: true
    }
  },
  mounted() {
    CodeEditorEvents.$on('openFile', this.openFile);
    CodeEditorEvents.$on('closeFile', this.closeFile);
  },
  destroyed() {
    CodeEditorEvents.$off('openFile');
    CodeEditorEvents.$off('closeFile');
  },
  methods: {
    openFile(file) {
      this.$store.commit('openFile', file);
      this.updateScroll(file);
    },
    closeFile(file) {
      this.$store.commit('closeFile', file);
      this.updateScroll();
    },
    scrollLeft() {
      let node = document.querySelector('.files');
      if (node) {
        node.scrollLeft -= 150;
        this.updateScrollButtons();
      }
    },
    scrollRight() {
      let node = document.querySelector('.files');
      if (node) {
        node.scrollLeft += 150;
        this.updateScrollButtons();
      }
    },
    updateScroll(file) {
      if (this.$store.state.project.files.length < 2) {
        return;
      }
      this.updateScrollButtons();
      if (this.$store.state.project.files.length === 0) {
        return;
      }
      if (file) {
        setTimeout(() => {
          let newIndex = findIndex(this.$store.state.project.files, {id: file.id, type: file.type})
          let node = document.querySelector(".files");
          if (node) {
            document.querySelector(".files").scrollLeft = newIndex * 150;
          }
        }, 500);
      }
    },
    updateScrollButtons() {
      this.disableLeftScrollButton = true;
      this.disableRightScrollButton = true;
      let node = document.querySelector('.files');
      let scrollWidth = node.scrollWidth;
      let scrollLeft = node.scrollLeft;
      let clientWidth = node.clientWidth;
      if (scrollWidth > clientWidth) {
        if (scrollLeft > 0) {
          this.disableLeftScrollButton = false;
        }
        if ((scrollWidth - clientWidth) !== scrollLeft) {
          this.disableRightScrollButton = false;
        }
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
    },
  }
}
</script>