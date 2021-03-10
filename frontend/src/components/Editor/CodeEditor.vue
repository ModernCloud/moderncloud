<template>
  <div role="main">
    <div id="code-editor">
      <div class="files">
        <div class="file" :class="{open: item.id === file.id && item.type === file.type}" v-for="item in files" :key="item.type + '_' + item.id">
          <div class="name" @click="openFile(item)">
            <small v-if="item.type === 'endpoint'" :style="{
                  'display': 'inline-block',
                  'font-weight': 600,
                  'margin-right': '2px',
                  'color': methodLabelColor(item.method),
                  'font-size': '10px'
                }">{{item.method}}</small>
            <svg v-if="item.type === 'function'" xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 10h1c1 0 1 1 2.016 3.527c.984 2.473 .984 3.473 1.984 3.473h1" /><path d="M13 17c1.5 0 3 -2 4 -3.5s2.5 -3.5 4 -3.5" /><path d="M3 19c0 1.5 .5 2 2 2s2 -4 3 -9s1.5 -9 3 -9s2 .5 2 2" /><line x1="5" y1="12" x2="11" y2="12" /></svg>
            {{item.name}}
          </div>
          <div class="action" @click="removeFile(item)"><svg xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>
        </div>
      </div>
      <monaco-editor ref="monaco" class="monaco-editor" v-if="hasSourceCode" v-model="sourceCode" @change="changed"></monaco-editor>
      <div v-if="hasSourceCode === false" style="height: 100%; display: flex; align-items: center; justify-content: center; background: #efefef; font-size: 15px; color: #ccc;">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="160" height="160" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="7 8 3 12 7 16" /><polyline points="17 8 21 12 17 16" /><line x1="14" y1="4" x2="10" y2="20" /></svg>
      </div>
    </div>
  </div>
</template>

<script>
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import {CodeEditorEvents} from './code_editor_events';
import MonacoEditor from './MonacoEditor.vue';

export default {
  components: {
    MonacoEditor
  },
  data() {
    return {
      files: [],
      file: {
        id: null,
        type: null,
        sourceCode: null
      },
      sourceCode: null,
      hasSourceCode: false
    }
  },
  watch: {
    '$store.state.project.selected'() {
      this.file = {id: null, name: null, type: null, sourceCode: null};
      this.files = [];
      this.sourceCode = null;
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
      if (find(this.files, {id: file.id, type: file.type}) === undefined) {
        this.files.push(file);
      }
      this.file = file;
      this.sourceCode = file.sourceCode;
      this.hasSourceCode = true;
    },
    removeFile(file) {
      let index = findIndex(this.files, {id: file.id, type: file.type});
      this.files.splice(index, 1);
      if (file.id === this.file.id) {
        if (this.files.length === 0) {
          this.file = {id: null, name: null, type: null, sourceCode: null};
          this.hasSourceCode = false;
          this.sourceCode = null;
        } else {
          this.file = this.files[0];
          this.sourceCode = this.file.sourceCode;
        }
      }
    },
    changed(code) {
      this.file.sourceCode = code;
      CodeEditorEvents.$emit('fileChanged', this.file);
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
    }
  }
}
</script>