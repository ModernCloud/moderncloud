<template>
  <div class="info-panel">
    <div class="header-menu">
      <div style="flex-grow: 1">
        <div class="button" @click="menu_visible = !menu_visible">
          <div class="title">
            <h3 v-if="isOverview"><IconOverview :stroke-width="1.5" :width="18" :height="18" /> Overview</h3>
            <h3 v-if="isDeployment"><IconDeployment :stroke-width="1.5" :width="18" :height="18" /> Deployment</h3>
            <h3 v-if="isLogs"><IconLogs :stroke-width="1.5" :width="18" :height="18" /> Logs</h3>
          </div>
          <div class="icon">
            <IconChevronDown :width="20" :height="20" :stroke-width="1.5" />
          </div>
        </div>
        <div class="options" v-if="menu_visible">
          <div class="option-item" @click="showMode('deployment')">
            <IconDeployment :stroke-width="1.5" :width="18" :height="18" /> Deployment
            <IconCheck class="check" :stroke-width="2" :width="24" :height="24" v-if="isDeployment" />
          </div>
          <div class="option-item" @click="showMode('overview')">
            <IconOverview :stroke-width="1.5" :width="18" :height="18" /> Overview
            <IconCheck class="check" :stroke-width="2" :width="24" :height="24" v-if="isOverview" />
          </div>
          <div class="option-item" @click="showMode('logs')">
            <IconLogs :stroke-width="1.5" :width="18" :height="18" /> Logs
            <IconCheck class="check" :stroke-width="2" :width="24" :height="24" v-if="isLogs" />
          </div>
        </div>
      </div>
    </div>
    <perfect-scrollbar class="body" :options="{suppressScrollX: true}">
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
import IconDeployment from "@/components/Icons/IconDeployment";
import IconLogs from "@/components/Icons/IconLogs";
import IconOverview from "@/components/Icons/IconOverview";
import IconChevronDown from "@/components/Icons/IconChevronDown";
import IconCheck from "@/components/Icons/IconCheck";

export default {
  components: {
    IconCheck,
    IconChevronDown,
    IconOverview,
    IconLogs,
    IconDeployment,
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
      mode: 'deployment'
    }
  },
  watch: {
    file() {
      this.mode = 'deployment';
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