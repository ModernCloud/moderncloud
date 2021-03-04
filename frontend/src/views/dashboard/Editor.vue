<template>
  <div class="app">
    <page-header></page-header>
    <editor-aside ref="aside" @openFile="openFile"></editor-aside>
    <code-editor ref="codeEditor" @changed="codeChanged"></code-editor>
  </div>
</template>

<script>
import PageHeader from '../../components/Editor/Header.vue';
import EditorAside from '../../components/Editor/EditorAside.vue';
import CodeEditor from '../../components/Editor/CodeEditor.vue';

export default {
  components: {
    PageHeader,
    EditorAside,
    CodeEditor
  },
  methods: {
    openFile(file) {
      this.$refs.codeEditor.openFile(file);
    },
    codeChanged(file) {
      this.$refs.aside.codeChanged(file);
    }
  }
}
</script>