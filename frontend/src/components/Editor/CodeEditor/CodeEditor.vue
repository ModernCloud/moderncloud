<template>
  <div role="main" id="code-editor" :class="{collapsed: collapsed}">
    <div class="empty-state" v-if="sourceCode === null">
      <div>
        <h2>Welcome Back {{$store.state.account.user.name}}</h2>
        <p>Did you know that you can create an endpoint and then mix it with some magic stuff to get awesome results.</p>
      </div>
    </div>
    <div class="code-state" v-if="sourceCode !== null">
      <div class="code-area">
        <div class="tools">
          <a href="javascript:;" @click="scrollLeft()" class="button-scroll-left" :class="{disabled: disableLeftScrollButton}">
            <IconChevronLeft :stroke-width="1.7" :width="18" :height="18" />
          </a>
          <div class="files">
            <div class="file" :class="{open: item.id === $store.state.project.currentFile.id && item.type === $store.state.project.currentFile.type}" v-for="item in $store.state.project.files" :key="item.type + '_' + item.id">
              <div class="name" @click="openFile(item)">
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
              <div class="action" @click="removeFile(item)">
                <div class="icon">
                  <IconX :width="12" :height="12" :stroke-width="2" />
                </div>
              </div>
            </div>
          </div>
          <a href="javascript:;" @click="scrollRight()" class="button-scroll-right" :class="{disabled: disableRightScrollButton}">
            <IconChevronRight :stroke-width="1.7" :width="18" :height="18" />
          </a>
        </div>
        <monaco-editor ref="monaco" class="monaco-editor" v-model="sourceCode" @change="changed"></monaco-editor>
      </div>
      <InfoPanel v-if="sourceCode !== null && collapsed === false" ref="info" :file="$store.state.project.currentFile" />
    </div>
  </div>
</template>

<script>
import findIndex from 'lodash/findIndex';
import {CodeEditorEvents} from '@/lib/code_editor_events';
import MonacoEditor from './MonacoEditor.vue';
import InfoPanel from './InfoPanel.vue';
import IconChevronLeft from "@/components/Icons/IconChevronLeft";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconFunction from "@/components/Icons/IconFunction";
import IconX from "@/components/Icons/IconX";

export default {
  components: {
    IconX,
    IconFunction,
    IconChevronRight,
    IconChevronLeft,
    MonacoEditor,
    InfoPanel
  },
  data() {
    return {
      collapsed: false,
      disableLeftScrollButton: true,
      disableRightScrollButton: true,
      sourceCode: null,
      keyupTimer: null
    }
  },
  watch: {
    '$store.state.project.selected'() {
      this.sourceCode = null;
    }
  },
  mounted() {
    CodeEditorEvents.$on('openFile', this.openFile);
    CodeEditorEvents.$on('removeFile', this.removeFile);
    CodeEditorEvents.$on('addPackage', this.addPackage);
    if (this.$store.state.project.files.length > 0) {
      this.openFile(this.$store.state.project.currentFile);
    }
  },
  destroyed() {
    CodeEditorEvents.$off('openFile');
    CodeEditorEvents.$off('removeFile');
    CodeEditorEvents.$off('addPackage');
  },
  methods: {
    openFile(file) {
      this.$store.commit('openFile', file);
      this.sourceCode = file.sourceCode;
      if (this.$store.state.project.files.length < 2) {
        return;
      }
      this.updateScroll();
    },
    removeFile(file) {
      this.$store.commit('closeFile', file);
      if (this.$store.state.project.files.length === 0) {
        this.sourceCode = null;
        CodeEditorEvents.$emit('empty');
      } else {
        this.sourceCode = this.$store.state.project.currentFile.sourceCode;
      }
      this.updateScroll();
    },
    changed(code) {
      this.$store.commit('updateSourceCode', code);
      if (this.keyupTimer) {
        clearTimeout(this.keyupTimer);
        this.keyupTimer = null;
      }
      this.keyupTimer = setTimeout(() => {
        CodeEditorEvents.$emit('fileChanged', this.$store.state.project.currentFile);
      }, 700);
    },
    async addPackage(name, version) {
      await this.$refs.monaco.addExtraLib(name, version);
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
    showPanel() {
      this.$refs.info.show(this.$store.state.project.currentFile);
    },
    scrollLeft() {
      let content = document.querySelector(".files");
      content.scrollLeft -= 150;
      this.updateScrollButtons();
    },
    scrollRight() {
      let content = document.querySelector(".files");
      content.scrollLeft += 150;
      this.updateScrollButtons();
    },
    updateScroll(file) {
      this.updateScrollButtons();
      if (this.$store.state.project.files.length === 0) {
        return;
      }
      setTimeout(() => {
        let newIndex = findIndex(this.$store.state.project.files, {id: file.id, type: file.type})
        document.querySelector(".files").scrollLeft = newIndex * 150;
        this.updateScrollButtons();
      }, 200);
    },
    updateScrollButtons() {
      this.disableLeftScrollButton = true;
      this.disableRightScrollButton = true;
      let scrollWidth = document.querySelector('.files').scrollWidth;
      let scrollLeft = document.querySelector('.files').scrollLeft;
      let clientWidth = document.querySelector('.files').clientWidth;
      if (scrollWidth > clientWidth) {
        if (scrollLeft > 0) {
          this.disableLeftScrollButton = false;
        }
        if ((scrollWidth - clientWidth) !== scrollLeft) {
          this.disableRightScrollButton = false;
        }
      }
    }
  }
}
</script>