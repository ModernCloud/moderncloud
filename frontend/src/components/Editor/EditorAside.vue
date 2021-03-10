<template>
  <aside id="editor-aside">
    <popper trigger="clickToToggle" :options="{placement: 'bottom-end'}" :visible-arrow="false">
      <section class="brand" slot="reference">
        <router-link to="/" class="name"><span>Modern</span><span>Cloud</span></router-link>
        <div class="menu">{{$store.state.account.user.name.split(' ').map(item => {return item[0];}).join('')}}</div>
      </section>
      <div class="popper">
        <div class="popper-menu">
          <div class="title">{{$store.state.account.user.email}}</div>
          <div class="divider"></div>
          <router-link to="/settings/account"><svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><circle cx="12" cy="12" r="3" /></svg> Settings</router-link>
          <a href="javascript:;" @click="logout"><svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M7 12h14l-3 -3m0 6l3 -3" /></svg> Logout</a>
        </div>
      </div>
    </popper>
    <popper trigger="clickToToggle" ref="projectsPopper" :options="{placement: 'bottom-end'}" :visible-arrow="false">
      <section class="projects" slot="reference">
        <div class="current-project" v-if="loading">
          <div class="name">Loading...</div>
        </div>
        <div class="current-project" v-if="loading === false">
          <div class="name">{{$store.state.project.selected.name || null}}</div>
          <div class="description">Current project</div>
        </div>
        <div class="menu">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="12" height="12" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </section>
      <div class="popper">
        <div class="popper-menu">
          <router-link to="/settings/projects"><svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /><path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" /></svg> New Project</router-link>
          <router-link to="/settings/projects"><svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><line x1="5" y1="6" x2="5" y2="6.01" /><line x1="5" y1="12" x2="5" y2="12.01" /><line x1="5" y1="18" x2="5" y2="18.01" /></svg> Projects</router-link>
          <div class="divider"></div>
          <a href="javascript:;" v-for="project in $store.state.project.projects" :key="project.id" @click="$store.commit('selectProject', project.id); $refs.projectsPopper.doClose()">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18" /></svg>
            {{project.name}}
          </a>
        </div>
      </div>
    </popper>
    <Endpoints />
    <Functions />
    <Packages />
  </aside>
</template>

<script>
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import Endpoints from './Endpoints.vue';
import Functions from './Functions.vue';
import Packages from './Packages.vue';

export default {
  components: {
    Popper,
    Endpoints,
    Functions,
    Packages
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