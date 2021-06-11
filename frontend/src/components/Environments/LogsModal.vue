<template>
  <div v-if="visible" class="fullscreen">
    <div style="height: 50px; padding-left: 20px; border-bottom: 1px solid #ddd; display: flex; align-items: center; background: #fff;">
      <a href="javascript:;" @click="visible = false; logs = []">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </a>
    </div>
    <div class="fullscreen-wrapper">
      <div style="padding: 20px;">
        <pre v-for="(log, index) in logs" :key="`log-${index}`">{{log.detail}}</pre>
        <pre style="height: 50px;"></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      logs: []
    }
  },
  methods: {
    show(logs) {
      this.visible = true;
      this.logs = logs;
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 600000;
  background: #fff;
  color: #000;
  overflow: hidden;
  cursor: auto;

  .fullscreen-wrapper {
    overflow-y: auto;
    height: 100%;
  }
}

pre {
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;
  font-weight: 400;
  font-size: 13px;
  margin-bottom: 0;
}
</style>