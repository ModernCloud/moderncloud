<template>
  <div v-if="visible" class="fullscreen">
    <sui-button icon="cancel" style="margin-left: 20px; margin-top: 20px;" href="javascript:;" @click="visible = false; logs = []">Close</sui-button>
    <div class="wrapper">
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
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  background: #fff;
  color: #000;

  .wrapper {
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
}
</style>