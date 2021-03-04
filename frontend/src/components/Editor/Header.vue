<template>
  <header>
    <sui-menu attached="top">
      <sui-dropdown item icon="settings" simple>
        <sui-dropdown-menu style="width: 200px;">
          <sui-dropdown-item>
            <sui-icon name="dropdown" />
            <span className="text">Projects</span>
            <sui-dropdown-menu>
              <sui-dropdown-item @click="$router.push('/settings/projects');">New Project</sui-dropdown-item>
              <sui-divider></sui-divider>
              <sui-dropdown-item v-for="project in $store.state.project.projects" :key="project.id" @click="project_id = project.id">{{project.name}}</sui-dropdown-item>
            </sui-dropdown-menu>
          </sui-dropdown-item>
          <sui-dropdown-divider />
          <sui-dropdown-item @click="$router.push('/settings/account');">Settings</sui-dropdown-item>
          <sui-dropdown-item @click="logout">Logout</sui-dropdown-item>
        </sui-dropdown-menu>
      </sui-dropdown>
      <div style="font-size: 12px; margin-left: 10px;">
        <strong>{{$store.state.project.selected.name}}</strong>
        <div style="color: #777;">Current Project</div>
      </div>
      <sui-menu-menu position="right">
        <sui-menu-item>Beta</sui-menu-item>
      </sui-menu-menu>
    </sui-menu>
  </header>
</template>

<script>
export default {
  data() {
    return {
      project_id: null
    }
  },
  watch: {
    project_id() {
      this.$store.commit('selectProject', this.project_id);
    }
  },
  async mounted() {
    await this.loadProjects();
  },
  methods: {
    async loadProjects() {
      try {
        await this.$store.commit('loadProjects');
      } catch (e) {
        if (e.response.status === 401) {
          this.logout();
        }
      }
    },
    logout() {
      this.$store.commit('logout');
      this.$store.commit('clearSelectedProject');
      this.$router.push({path: '/login'});
    }
  }
}
</script>