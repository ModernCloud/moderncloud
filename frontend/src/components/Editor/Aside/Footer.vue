<template>
  <section class="footer">
    <ProjectModal ref="modal" />
    <div class="buttons">
      <div class="button-projects" @mouseover="menu_projects_visible = true" @mouseleave="menu_projects_visible = false">
        <IconLayers :width="24" :height="24" />
        <div class="name">
          <div>{{$store.state.project.selected ? $store.state.project.selected.name : null}}</div>
          <small>Current project</small>
        </div>
        <transition name="slide">
          <div class="menu" v-if="menu_projects_visible">
            <a href="javascript:;" class="new-link" @click="$refs.modal.showAdd">
              <IconSquarePlus :width="16" :height="16" />
              New Project
            </a>
            <a href="javascript:;" @click.self="$store.commit('selectProject', item.id);" v-for="item in $store.state.project.projects" :key="item.id">
              <IconChevronRight :width="16" :height="16" />
              {{item.name}}
              <div class="action-menu">
                <a href="javascript:;" @click="$refs.modal.showEdit(item.id)"><IconEdit :width="14" :height="14" :stroke-width="1" /></a>
              </div>
            </a>
          </div>
        </transition>
      </div>
      <div class="button-settings" @mouseover="menu_settings_visible = true" @mouseleave="menu_settings_visible = false">
        <IconSettings :width="18" :height="18" />
        <transition name="slide">
          <div class="menu" v-if="menu_settings_visible">
            <router-link to="/settings/account">
              <IconSettings :width="16" :height="16" />
              Settings
            </router-link>
            <a href="javascript:;" @click="logout">
              <IconLogout :width="16" :height="16" />
              Logout
            </a>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import ProjectModal from "@/components/Settings/Projects/ProjectModal";
import IconLayers from "@/components/Icons/IconLayers";
import IconSettings from "@/components/Icons/IconSettings";
import IconSquarePlus from "@/components/Icons/IconSquarePlus";
import IconLogout from "@/components/Icons/IconLogout";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconEdit from "@/components/Icons/IconEdit";

export default {
  components: {
    IconEdit,
    IconChevronRight,
    IconLogout,
    IconSquarePlus,
    IconSettings,
    IconLayers,
    ProjectModal
  },
  data() {
    return {
      menu_projects_visible: false,
      menu_settings_visible: false
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