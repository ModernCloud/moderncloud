<template>
  <div role="main">
    <monaco-editor class="monaco-editor" v-if="hasSourceCode" v-model="file.sourceCode" @change="changed"></monaco-editor>
    <div v-if="hasSourceCode === false" style="height: 100%; display: flex; align-items: center; justify-content: center; background: #ccc;">Please select a function or endpoint.</div>
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
  },
  destroyed() {
    CodeEditorEvents.$off('openFile');
    CodeEditorEvents.$off('removeFile');
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
    }
  }
}
</script>