<template>
  <div class="info-panel">
    <div class="header-menu" @mouseover="menu_visible = true" @mouseleave="menu_visible = false">
      <div class="button">
        <div class="icon">
          <IconChevronVertical :width="30" :height="30" :stroke-width="1.3" />
        </div>
        <div class="title">
          <h3 v-if="isOverview"><IconOverview :stroke-width="1.5" /> Overview</h3>
          <h3 v-if="isDeployment"><IconDeployment :stroke-width="1.5" /> Deployment</h3>
          <h3 v-if="isLogs"><IconLogs :stroke-width="1.5" /> Logs</h3>
        </div>
      </div>
      <transition name="slide">
        <div class="options" v-if="menu_visible">
          <a href="javascript:;" @click="showMode('overview')">Overview</a>
          <a href="javascript:;" @click="showMode('deployment')">Deployment</a>
          <a href="javascript:;" @click="showMode('logs')">Logs</a>
        </div>
      </transition>
    </div>
    <perfect-scrollbar class="body" style="position: unset;" :options="{suppressScrollX: true}">
      <Overview v-if="isOverview" :file="file" />
      <Deployment v-if="isDeployment" :file="file" />
      <Logs v-if="isLogs" :file="file" />
    </perfect-scrollbar>
  </div>
</template>

<script>
import Overview from "@/components/Editor/CodeEditor/InfoPanel/Overview";
import Deployment from "@/components/Editor/CodeEditor/InfoPanel/Deployment";
import Logs from "@/components/Editor/CodeEditor/InfoPanel/Logs";
import IconChevronVertical from "@/components/Icons/IconChevronVertical";
import IconDeployment from "@/components/Icons/IconDeployment";
import IconLogs from "@/components/Icons/IconLogs";
import IconOverview from "@/components/Icons/IconOverview";

export default {
  components: {
    IconOverview,
    IconLogs,
    IconDeployment,
    IconChevronVertical,
    Deployment,
    Overview,
    Logs
  },
  props: {
    file: {
      type: Object
    }
  },
  data() {
    return {
      menu_visible: false,
      mode: 'overview'
    }
  },
  watch: {
    file() {
      this.mode = 'overview';
    }
  },
  computed: {
    isOverview() {
      return this.mode === 'overview';
    },
    isDeployment() {
      return this.mode === 'deployment';
    },
    isLogs() {
      return this.mode === 'logs';
    }
  },
  methods: {
    showMode(mode) {
      this.menu_visible = false;
      this.mode = mode;
    }
  }
}
</script>