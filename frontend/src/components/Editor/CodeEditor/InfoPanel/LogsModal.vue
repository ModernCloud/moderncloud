<template>
  <div v-if="visible" class="fullscreen">
    <div style="height: 50px; padding-left: 20px; border-bottom: 1px solid #ddd; display: flex; align-items: center; background: #fff;">
      <a href="javascript:;" @click="visible = false; logs = []">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </a>
    </div>
    <div class="fullscreen-wrapper">
      <div style="padding: 20px;">
        <div v-for="(log, index) in logEvents" :key="`log-${index}`" class="line">
          <div class="time">{{formatDate(log.ingestionTime)}}</div>
          <div class="message">
            <pre>{{log.message}}</pre>
          </div>
        </div>
        <div style="height: 50px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      visible: false,
      logEvents: [],
      selectedEnvironmentId: null,
      logStreamName: null,
      functionName: null,
      timeoutId: null
    }
  },
  watch: {
    visible() {
      if (this.visible === false && this.timeoutId != null) {
        clearTimeout(this.timeoutId);
      } else {
        this.loadStreamEvents();
      }
    }
  },
  destroyed() {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
  },
  methods: {
    show(environmentId, functionName, logStreamName) {
      this.selectedEnvironmentId = environmentId;
      this.logStreamName = logStreamName;
      this.functionName = functionName;
      this.logsEvents = [];
      this.visible = true;
    },
    async loadStreamEvents() {
      this.loading = true;
      try {
        let response = await axios.get(`/api/environments/${this.selectedEnvironmentId}/stream-events/${this.functionName}/${encodeURIComponent(this.logStreamName)}`);
        this.logEvents = response.data.log_events.events;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
        this.timeoutId = setTimeout(async () => {
          if (this.loading) {
            return;
          }
          await this.loadStreamEvents();
        }, 10000);
      }
    },
    formatDate(timestamp) {
      return moment(timestamp).format('DD MM YYYY HH:mm:ss Z');
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

.line {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;

  &:hover {
  }
}

.time {
  font-size: 13px;
  font-weight: 400;
  margin-right: 20px;
}

pre {
  vertical-align: baseline;
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;
  font-weight: 400;
  font-size: 13px;
  margin: 0;
}
</style>