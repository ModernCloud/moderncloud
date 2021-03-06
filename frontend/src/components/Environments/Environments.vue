<template>
  <div class="fullscreen">
    <EnvironmentModal ref="modal" @added="added" @updated="updated" />
    <sui-button icon="left arrow" size="mini" style="margin-left: 20px; margin-top: 20px;" href="javascript:;" @click="$parent.hideEnvironments();">Return back</sui-button>
    <sui-button icon="plus" size="mini" color="green" @click="$refs.modal.showAdd()">New Environment</sui-button>
    <div class="wrapper">
      <div style="padding: 20px;">
        <sui-icon name="spinner" loading v-if="loading" />
        <sui-table v-if="loading === false" style="margin-bottom: 40px;">
          <sui-table-header>
            <sui-table-row>
              <sui-table-header-cell style="width: 150px;"></sui-table-header-cell>
              <sui-table-header-cell>Environment</sui-table-header-cell>
              <sui-table-header-cell style="width: 250px; text-align: right">Last Deployment</sui-table-header-cell>
            </sui-table-row>
          </sui-table-header>
          <sui-table-body>
            <EnvironmentRow v-for="environment in environments" :key="environment.id" :environment="environment" @openEdit="openEdit" />
          </sui-table-body>
        </sui-table>
      </div>
    </div>
  </div>
</template>

<script>
import EnvironmentRow from './EnvironmentRow.vue';
import EnvironmentModal from './EnvironmentModal.vue';
import axios from "axios";

export default {
  components: {
    EnvironmentModal,
    EnvironmentRow
  },
  data() {
    return {
      loading: false,
      environments: []
    }
  },
  async mounted() {
    await this.loadEnvironments();
  },
  methods: {
    async loadEnvironments() {
      this.loading = true;
      try {
        let response = await axios.get('/api/environments?with_last_deployment=true',{
          params: {
            project_id: this.$store.state.project.selected.id
          }
        });
        this.environments = response.data.environments;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    added() {
      this.loadEnvironments();
    },
    updated() {
      this.loadEnvironments();
    },
    openEdit(id) {
      this.$refs.modal.showEdit(id)
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
  z-index: 10000;
  background: #fff;

  .wrapper {
    overflow-y: auto;
    height: 100%;
  }
}
</style>