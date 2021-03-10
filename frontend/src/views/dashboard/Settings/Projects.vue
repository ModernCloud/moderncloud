<template>
  <div role="main">
    <ProjectModal ref="modal" />
    <div class="page">
      <div class="content">
        <div class="header">
          <div>
            <div class="title">Projects</div>
            <div class="subtitle">Manage your projects</div>
          </div>
          <div class="actions">
            <button type="button" class="btn btn-primary" @click="openNewModal">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /><path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" /></svg>
              New Project
            </button>
          </div>
        </div>
        <p v-if="initialized === false">Loading...</p>
        <table v-if="initialized" class="table table-hover" style="margin-top: 10px;">
          <thead>
            <tr>
              <th style="width: 30px;"></th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in $store.state.project.projects" :key="project.id">
              <td>
                <a href="javascript:;" @click="openEditModal(project.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z" /><path d="M16 5l3 3" /><path d="M9 7.07a7.002 7.002 0 0 0 1 13.93a7.002 7.002 0 0 0 6.929 -5.999" /></svg>
                </a>
              </td>
              <td>{{project.name}}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
      initialized: false,
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
        this.initialized = true;
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