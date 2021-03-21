<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon" :width="width" :height="height" viewBox="0 0 24 24" :stroke-width="strokeWidth" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="8 8 12 4 16 8" /><polyline points="16 16 12 20 8 16" /></svg>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    },
    strokeWidth: {
      type: Number,
      default: 1
    }
  }
}
</script>