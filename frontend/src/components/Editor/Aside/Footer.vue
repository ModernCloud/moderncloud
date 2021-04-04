<template>
  <section class="footer">
    <ProjectModal ref="modal" />
    <div class="buttons">
      <div class="button-settings" @click="$router.push('/settings/account');">
        <IconSettings :width="18" :height="18" />
        Settings
      </div>
      <div class="button-projects" @click="menu_projects_visible = !menu_projects_visible" :class="{active: menu_projects_visible}">
        <IconLayers :width="18" :height="18" />
        <div class="name">
          <div>{{$store.state.project.selected ? $store.state.project.selected.name : null}}</div>
        </div>
        <IconChevronUp class="chevron" :width="18" :height="18" :stroke-width="2" v-if="menu_projects_visible === false" />
        <IconChevronDown class="chevron" :width="18" :height="18" :stroke-width="2" v-if="menu_projects_visible" />
        <div class="menu" v-if="menu_projects_visible" @mouseover="mouse_over_projects_menu = true" @mouseout="mouse_over_projects_menu = false">
          <a href="javascript:;" @click.self="$store.commit('selectProject', item.id);" v-for="item in $store.state.project.projects" :key="item.id">
            <IconChevronRight :width="16" :height="16" />
            {{item.name}}
            <div class="action-menu">
              <a href="javascript:;" @click="$refs.modal.showEdit(item.id)"><IconEdit :width="14" :height="14" :stroke-width="1" /></a>
            </div>
          </a>
          <a href="javascript:;" class="new-link" @click="$refs.modal.showAdd">
            <IconSquarePlus :width="16" :height="16" />
            New Project
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ProjectModal from "@/components/Settings/Projects/ProjectModal";
import IconLayers from "@/components/Icons/IconLayers";
import IconSettings from "@/components/Icons/IconSettings";
import IconSquarePlus from "@/components/Icons/IconSquarePlus";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconChevronUp from "@/components/Icons/IconChevronUp";
import IconEdit from "@/components/Icons/IconEdit";
import IconChevronDown from "@/components/Icons/IconChevronDown";

export default {
  components: {
    IconChevronDown,
    IconEdit,
    IconChevronRight,
    IconChevronUp,
    IconSquarePlus,
    IconSettings,
    IconLayers,
    ProjectModal
  },
  data() {
    return {
      menu_projects_visible: false,
      menu_settings_visible: false,
      mouse_over_projects_menu: false,
    }
  },
  watch: {
    menu_projects_visible() {
      if (this.menu_projects_visible === true) {
        document.addEventListener('mousedown', this.mouseDownEventListener);
      } else {
        document.removeEventListener('mousedown', this.mouseDownEventListener);
      }
    }
  },
  async mounted() {
    await this.loadProjects();
  },
  destroyed() {
    document.removeEventListener('mousedown', this.mouseDownEventListener);
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
    mouseDownEventListener () {
      console.log('OKOK');
      if (this.mouse_over_projects_menu === false && this.menu_projects_visible === true) {
        this.menu_projects_visible = false;
      }
    }
  }
}
</script>