<template>
  <div id="editor"></div>
</template>

<script>
import * as monaco from 'monaco-editor';

export default {
  props: ['value'],
  data() {
    return {
      monacoEditor: null
    }
  },
  watch: {
    value() {
      this.monacoEditor.setValue(this.value);
    }
  },
  mounted() {
    this.monacoEditor = monaco.editor.create(document.getElementById('editor'), {
      value: this.value,
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
    });
    this.monacoEditor.getModel().onDidChangeContent(() => {
      this.$emit('change', this.monacoEditor.getValue())
    });
  }
}
</script>

<style lang="scss" scoped>
  #editor {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>