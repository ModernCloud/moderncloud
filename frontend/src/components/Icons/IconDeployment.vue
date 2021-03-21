<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 24" :stroke-width="strokeWidth" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" /><polyline points="13 14 11 18 14 18 12 22" /></svg>
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