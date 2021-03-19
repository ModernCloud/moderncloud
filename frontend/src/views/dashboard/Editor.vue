<template>
  <div class="app">
    <EditorAside ref="aside"></EditorAside>
    <CodeEditor ref="codeEditor" @changed="codeChanged"></CodeEditor>
  </div>
</template>

<script>
import EditorAside from '@/components/Editor/Aside/EditorAside.vue';
import CodeEditor from '@/components/Editor/CodeEditor/CodeEditor.vue';

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