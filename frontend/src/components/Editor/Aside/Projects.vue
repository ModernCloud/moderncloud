<template>
  <section class="accordion">
    <ProjectModal ref="modal"  />
    <div class="section-title" @click="showContent=!showContent" :class="{active: showContent}">
      <IconLayers :width="18" :height="18" />
      <div>
        <div style="line-height: 13px;">{{$store.state.project.selected ? $store.state.project.selected.name : null}}</div>
        <span style="display: block; font-size: 11px; color: #aaa; margin-top: 3px;">Current project</span>
      </div>
      <span v-if="loading" class="spinner-grow text-primary spinner-grow-sm" style="margin-left: 5px; width: 5px; height: 5px;" role="status" aria-hidden="true"></span>
      <div style="margin-left: auto;">
        <IconChevronRight v-if="showContent === false" :width="12" :height="12" :stroke-width="2" />
        <IconChevronDown v-if="showContent" :width="12" :height="12" :stroke-width="2" />
      </div>
    </div>
    <transition name="slide">
      <div v-if="showContent" class="content">
        <div v-if="loading === false">
          <div class="item">
            <a href="javascript:;" class="new-link" @click="$refs.modal.showAdd">
              <IconSquarePlus :width="18" :height="18" /> New Project
            </a>
          </div>
          <div v-for="item in $store.state.project.projects" :key="item.id">
            <div class="item">
              <a href="javascript:;" @click="$store.commit('selectProject', item.id); showContent = false;">
                <div class="item-name">{{item.name}}</div>
              </a>
              <div class="action-menu">
                <a href="javascript:;" @click="openEditModal(item.id)">
                  <IconEdit :width="14" :height="14" :stroke-width="1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import IconSquarePlus from "@/components/Icons/IconSquarePlus";
import IconChevronRight from "@/components/Icons/IconChevronRight";
import IconChevronDown from "@/components/Icons/IconChevronDown";
import IconLayers from "@/components/Icons/IconLayers";
import ProjectModal from "@/components/Settings/Projects/ProjectModal";
import IconEdit from "@/components/Icons/IconEdit";

export default {
  components: {IconEdit, IconLayers, IconChevronDown, IconChevronRight, IconSquarePlus, ProjectModal},
  data() {
    return {
      loading: false,
      showContent: false
    }
  },
  methods: {
    openEditModal(id) {
      this.$refs.modal.showEdit(id);
    }
  }
}
</script>