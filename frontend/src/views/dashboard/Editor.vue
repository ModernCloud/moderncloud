<template>
  <div class="app">
    <editor-aside ref="aside"></editor-aside>
    <code-editor ref="codeEditor" @changed="codeChanged"></code-editor>
  </div>
</template>

<script>
import EditorAside from '../../components/Editor/EditorAside.vue';
import CodeEditor from '../../components/Editor/CodeEditor.vue';

export default {
  components: {
    EditorAside,
    CodeEditor
  },
  methods: {
    codeChanged(file) {
      this.$refs.aside.codeChanged(file);
    }
  }
}
</script>