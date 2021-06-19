<template>
  <div class="info-panel">
    <perfect-scrollbar class="body" :options="{suppressScrollX: true}">
      <div v-if="isDeployment">
        <a href="javascript:;" class="section-link" @click="showMode('overview')">Overview <IconArrowNarrowRight /></a>
        <a href="javascript:;" class="section-link" @click="showMode('packages')">Packages <IconArrowNarrowRight /></a>
        <a href="javascript:;" class="section-link" @click="showMode('logs')">Logs <IconArrowNarrowRight /></a>
      </div>
      <div v-if="isDeployment === false">
        <a href="javascript:;" class="section-link go-back" @click="showMode('deployment')"><IconChevronLeft /> Return</a>
      </div>
      <Overview v-if="isOverview" :file="file" />
      <Deployment v-if="isDeployment" :file="file" />
      <Packages v-if="isPackages" :file="file" />
      <Logs v-if="isLogs" :file="file" />
    </perfect-scrollbar>
  </div>
</template>

<script>
import Overview from "@/components/Editor/CodeEditor/InfoPanel/Overview";
import Deployment from "@/components/Editor/CodeEditor/InfoPanel/Deployment";
import Packages from "@/components/Editor/CodeEditor/InfoPanel/Packages";
import Logs from "@/components/Editor/CodeEditor/InfoPanel/Logs";
import IconArrowNarrowRight from "@/components/Icons/IconArrowNarrowRight";
import IconChevronLeft from "@/components/Icons/IconChevronLeft";

export default {
  components: {
    IconChevronLeft,
    IconArrowNarrowRight,
    Deployment,
    Overview,
    Packages,
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
    isPackages() {
      return this.mode === 'packages';
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