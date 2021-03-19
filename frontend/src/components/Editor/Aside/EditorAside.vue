<template>
  <aside id="editor-aside">
    <section class="brand">
      <router-link to="/" class="name">Modern Cloud</router-link>
    </section>
    <perfect-scrollbar class="modules" :options="{suppressScrollX: true}">
        <Projects />
        <Endpoints />
        <Functions />
        <Packages />
        <DynamoDB />
    </perfect-scrollbar>
    <section class="footer">
      <router-link to="/settings/account">
        <IconSettings :width="18" :height="18" />
        Settings
      </router-link>
      <a href="javascript:;" @click="logout">
        <IconLogout :width="18" :height="18" />
      </a>
    </section>
  </aside>
</template>

<script>
import Projects from './Projects.vue';
import Endpoints from './Endpoints.vue';
import Functions from './Functions.vue';
import Packages from './Packages.vue';
import DynamoDB from "./DynamoDB.vue";
import IconSettings from "@/components/Icons/IconSettings";
import IconLogout from "@/components/Icons/IconLogout";

export default {
  components: {
    IconLogout,
    IconSettings,
    DynamoDB,
    Endpoints,
    Functions,
    Packages,
    Projects
  },
  data() {
    return {
      loading: false
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
    logout() {
      this.$store.commit('logout');
      this.$store.commit('clearSelectedProject');
      this.$router.push({path: '/login'});
    }
  }
}
</script>