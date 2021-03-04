<template>
  <div role="main">
    <prism-editor v-if="hasSourceCode" class="my-editor" v-model="file.sourceCode" :highlight="highlighter"
                  line-numbers
                  @input="changed"
    ></prism-editor>
    <div v-if="hasSourceCode === false" style="height: 100%; display: flex; align-items: center; justify-content: center; background: #ccc;">Please select a function or endpoint.</div>
  </div>
</template>

<script>
import {CodeEditorEvents} from './code_editor_events';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/themes/prism-solarizedlight.css';

export default {
  components: {
    PrismEditor
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
    },
    highlighter(code) {
      return highlight(code, languages.js);
    },
  }
}
</script>

<style>
  .prism-editor__textarea:focus {
    outline: none;
  }

  .my-editor {
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }
</style>