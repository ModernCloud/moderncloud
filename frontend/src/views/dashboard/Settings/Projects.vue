<template>
  <div role="main">
    <ProjectModal ref="modal" />
    <div style="padding: 20px;">
      <sui-icon name="spinner" loading v-if="loading" />
      <sui-button icon="plus" color="green" @click="openNewModal">New Project</sui-button>
      <sui-table v-if="loading === false">
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell style="width: 50px;"></sui-table-header-cell>
            <sui-table-header-cell>Project Name</sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>
        <sui-table-body>
          <sui-table-row v-for="project in $store.state.project.projects" :key="project.id">
            <sui-table-cell><a href="javascript:;" @click="openEditModal(project.id)">Edit</a></sui-table-cell>
            <sui-table-cell>{{project.name}}</sui-table-cell>
          </sui-table-row>
        </sui-table-body>
      </sui-table>
    </div>
  </div>
</template>

<script>
import ProjectModal from './ProjectModal.vue';

export default {
  components: {
    ProjectModal
  },
  data() {
    return {
      loading: false,
      projects: []
    }
  },
  async mounted() {
    await this.loadProjects();
  },
  methods: {
    async loadProjects() {
      this.loading = true;
      try {
        await this.$store.commit('loadProjects');
      } catch (e) {
        if (e.response.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    openNewModal() {
      this.$refs.modal.showAdd();
    },
    openEditModal(id) {
      this.$refs.modal.showEdit(id);
    },
  }
}
</script>