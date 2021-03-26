<template>
  <div class="overview">
    <section>
      <h3>File Details</h3>
      <div>
        <table>
          <tr v-if="file.type === 'endpoint'">
            <th>Endpoint</th>
            <td>
              {{ file.method }}
              {{ file.path }}
            </td>
          </tr>
          <tr v-if="file.type === 'function'">
            <th>Function</th>
            <td>{{ file.name }}</td>
          </tr>
        </table>
      </div>
    </section>
    <div class="menu">
      <div class="environments">
        <a href="javascript:;" v-for="environment in environments" :key="environment.id" :class="{active: selectedEnvironmentId === environment.id}" @click="selectedEnvironmentId = environment.id">{{environment.name}}</a>
      </div>
      <div class="time">
        <a href="javascript:;" @click="timePeriod = 1" :class="{active: timePeriod === 1}">1h</a>
        <a href="javascript:;" @click="timePeriod = 3" :class="{active: timePeriod === 3}">3h</a>
        <a href="javascript:;" @click="timePeriod = 6" :class="{active: timePeriod === 6}">6h</a>
        <a href="javascript:;" @click="timePeriod = 12" :class="{active: timePeriod === 12}">12h</a>
        <a href="javascript:;" @click="timePeriod = 24" :class="{active: timePeriod === 24}">24h</a>
      </div>
    </div>
    <div class="stats">
      <div class="number">{{metrics.totalInvocations}}</div>
      <div class="title">Total Invocations</div>
    </div>
    <div class="stats">
      <div class="number">{{metrics.totalErrors}}</div>
      <div class="title">Total Errors</div>
    </div>
    <div class="stats">
      <div class="number">{{metrics.avgConcurrency}}</div>
      <div class="title">Avg. Concurrency</div>
    </div>
    <div class="stats">
      <div class="number">{{metrics.avgDuration}}</div>
      <div class="title">Avg. Duration (ms)</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import sum from 'lodash/sum';
import mean from 'lodash/mean';

export default {
  props: {
    file: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      loadingEnvironments: false,
      loadingMetrics: false,
      environments: [],
      selectedEnvironmentId: 0,
      timePeriod: 1,
      metrics: {
        totalInvocations: 0,
        totalErrors: 0,
        avgDuration: 0,
        avgConcurrency: 0
      },
      timeoutId: null
    }
  },
  watch: {
    async file() {
      await this.loadEnvironments();
    },
    async selectedEnvironmentId() {
      await this.loadMetrics();
    },
    async timePeriod() {
      await this.loadMetrics();
    }
  },
  async mounted() {
    await this.loadEnvironments();
  },
  destroyed() {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
  },
  methods: {
    async loadEnvironments() {
      this.loadingEnvironments = true;
      try {
        let response = await axios.get('/api/environments',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.environments = response.data.environments;
        this.selectedEnvironmentId = this.environments[0].id;
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingEnvironments = false;
      }
    },
    async loadMetrics() {
      this.metrics.totalInvocations = '...';
      this.metrics.totalErrors = '...';
      this.metrics.avgConcurrency = '...';
      this.metrics.avgDuration = '...'
      this.loadingMetrics = true;
      try {
        let response = await axios.get(`/api/environments/${this.selectedEnvironmentId}/metrics/${this.file.function_name}?time_period=${this.timePeriod}`);
        this.metrics.totalInvocations = sum(response.data.metrics.invocations.MetricDataResults[0].Values);
        this.metrics.totalErrors = sum(response.data.metrics.errors.MetricDataResults[0].Values);
        this.metrics.avgConcurrency = mean(response.data.metrics.concurrency.MetricDataResults[0].Values).toFixed(2);
        this.metrics.avgDuration = mean(response.data.metrics.duration.MetricDataResults[0].Values).toFixed(2);
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingMetrics = false;
        this.timeoutId = setTimeout(async () => {
          if (this.loadingMetrics) {
            return;
          }
          await this.loadMetrics();
        }, 10000);
      }
    },
  }
}
</script>