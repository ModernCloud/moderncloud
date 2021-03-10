<template>
  <div role="main">
    <monaco-editor ref="monaco" class="monaco-editor" v-if="hasSourceCode" v-model="file.sourceCode" @change="changed"></monaco-editor>
    <div v-if="hasSourceCode === false" style="height: 100%; display: flex; align-items: center; justify-content: center; background: #efefef; font-size: 15px; color: #ccc;">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="160" height="160" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="7 8 3 12 7 16" /><polyline points="17 8 21 12 17 16" /><line x1="14" y1="4" x2="10" y2="20" /></svg>
    </div>
  </div>
</template>

<script>
import {CodeEditorEvents} from './code_editor_events';
import MonacoEditor from './MonacoEditor.vue';

export default {
  components: {
    MonacoEditor
  },
  data() {
    return {
      file: {
        id: null,
        type: null,
        sourceCode: null
      },
      hasSourceCode: false
    }
  },
  watch: {
    '$store.state.project.selected'() {
      this.file = {id: null, type: null, sourceCode: null};
      this.hasSourceCode = false;
    }
  },
  mounted() {
    CodeEditorEvents.$on('openFile', this.openFile);
    CodeEditorEvents.$on('removeFile', this.removeFile);
    CodeEditorEvents.$on('addPackage', this.addPackage);
  },
  destroyed() {
    CodeEditorEvents.$off('openFile');
    CodeEditorEvents.$off('removeFile');
    CodeEditorEvents.$off('addPackage');
  },
  methods: {
    openFile(file) {
      this.file = file;
      this.hasSourceCode = true;
    },
    removeFile(file) {
      if (file.id === this.file.id) {
        this.file = {id: null, type: null, sourceCode: null};
        this.hasSourceCode = false;
      }
    },
    changed(code) {
      CodeEditorEvents.$emit('fileChanged', {...this.file, sourceCode: code});
    },
    async addPackage(name, version) {
      await this.$refs.monaco.addExtraLib(name, version);
    }
  }
}
</script>