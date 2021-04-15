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
  async mounted() {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      allowNonTsExtensions: true,
      allowJs: true,
    });
    this.monacoEditor = monaco.editor.create(document.getElementById('editor'), {
      value: this.value,
      language: "javascript",
      theme: this.$store.state.account.settings.theme === 'dark' ? 'vs-dark' : 'vs-light',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
    });
    this.monacoEditor.getModel().onDidChangeContent(() => {
      this.$emit('change', this.monacoEditor.getValue())
    });
  },
  methods: {
    async addExtraLib(name, version) {
      let url = 'https://unpkg.com/' + name + '@' + version;
      console.log(url);
    }
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