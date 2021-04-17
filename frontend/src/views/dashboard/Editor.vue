<template>
  <div class="app">
    <EditorAside></EditorAside>
    <CodeEditor></CodeEditor>
  </div>
</template>

<script>
import EditorAside from '@/components/Editor/Aside/EditorAside.vue';
import CodeEditor from '@/components/Editor/CodeEditor/CodeEditor.vue';

export default {
  components: {
    EditorAside,
    CodeEditor
  }
}
</script>