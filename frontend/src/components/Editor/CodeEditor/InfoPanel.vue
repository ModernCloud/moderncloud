<template>
  <div class="info-panel">
    <div class="file">
      <small v-if="file.type === 'endpoint'" :style="{
                'display': 'inline-block',
                'font-weight': 600,
                'margin-right': '8px',
                'color': methodLabelColor(file.method),
                'font-size': '9px'
              }">{{file.method}}</small>
      <IconFunction :width="12" :height="12" :stroke-width="2" v-if="file.type === 'function'" style="margin-right: 8px" />
      {{file.name}}
    </div>
    <perfect-scrollbar class="body" :options="{suppressScrollX: true}">
      <div v-if="isDeployment">
        <a href="javascript:;" class="section-link" @click="showMode('analytics')">Analytics <IconArrowNarrowRight /></a>
        <a href="javascript:;" class="section-link" @click="showMode('packages')"><span>Packages ( {{totalPackage}} )</span> <IconArrowNarrowRight /></a>
        <a href="javascript:;" class="section-link" @click="showMode('logs')">Logs <IconArrowNarrowRight /></a>
      </div>
      <div v-if="isDeployment === false">
        <a href="javascript:;" class="section-link go-back" @click="showMode('deployment')"><IconChevronLeft /> Return</a>
      </div>
      <Analytics v-if="isAnalytics" :file="file" />
      <Deployment v-if="isDeployment" :file="file" />
      <Packages v-if="isPackages" :file="file" />
      <Logs v-if="isLogs" :file="file" />
    </perfect-scrollbar>
  </div>
</template>

<script>
import Analytics from "@/components/Editor/CodeEditor/InfoPanel/Analytics";
import Deployment from "@/components/Editor/CodeEditor/InfoPanel/Deployment";
import Packages from "@/components/Editor/CodeEditor/InfoPanel/Packages";
import Logs from "@/components/Editor/CodeEditor/InfoPanel/Logs";
import IconArrowNarrowRight from "@/components/Icons/IconArrowNarrowRight";
import IconChevronLeft from "@/components/Icons/IconChevronLeft";
import IconFunction from "../../Icons/IconFunction";
import axios from "axios";

export default {
  components: {
    IconFunction,
    IconChevronLeft,
    IconArrowNarrowRight,
    Deployment,
    Analytics,
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
      mode: null,
      totalPackage: 0
    }
  },
  watch: {
    file() {
      this.mode = 'deployment';
    },
    mode() {
      if (this.isDeployment) {
        this.loadPackagesCount();
      }
    }
  },
  computed: {
    isAnalytics() {
      return this.mode === 'analytics';
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
  mounted() {
    this.mode = 'deployment';
  },
  methods: {
    showMode(mode) {
      this.menu_visible = false;
      this.mode = mode;
    },
    async loadPackagesCount() {
      try {
        let response = await axios.get('/api/packages/count',{
          params: {
            project_id: this.$store.state.project.selected.id,
            file_id: this.file.id,
            file_type: this.file.type
          }
        });
        this.totalPackage = response.data.total;
      } catch (e) {
        console.log(e);
      }
    },
    methodLabelColor(method) {
      if (method === 'POST') {
        return '#f77f00';
      } else if (method === 'DELETE') {
        return '#d62828';
      } else if (method === 'PUT') {
        return '#0077b6';
      } else {
        return '#55a630';
      }
    }
  }
}
</script>