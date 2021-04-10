<template>
  <div class="page">
    <ProjectModal ref="modal" />
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
      <div v-if="initialized" class="projects">
        <div class="project" v-for="project in $store.state.project.projects" :key="project.id">
          <div class="name">{{project.name}}</div>
          <div class="links">
            <a href="javascript:;" @click="openEditModal(project.id)" class="btn btn-light">Edit</a>
            <router-link :to="{name: 'environments', params: {project_id: project.id}}" class="btn btn-light">Environments</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectModal from '@/components/Settings/Projects/ProjectModal.vue';

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

<style lang="scss" scoped>
  .projects {
    .project {
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 10px;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

      .name {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 18px;
      }

      .links {
        margin-top: 5px;
        display: flex;

        a {
          font-size: 11px;
          margin-right: 5px;
          min-width: auto;

          &:hover {
            background: rgba(0, 0, 0, .16);
          }
        }
      }
    }
  }
</style>