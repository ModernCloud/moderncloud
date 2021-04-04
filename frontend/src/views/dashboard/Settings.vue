<template>
  <div class="app">
    <settings-aside></settings-aside>
    <div role="main" id="settings">
      <div class="back-button">
        <router-link to="/"><IconChevronLeft :width="18" :height="18" /> Settings</router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SettingsAside from '@/components/Settings/SettingsAside.vue';
import IconChevronLeft from "@/components/Icons/IconChevronLeft";

export default {
  components: {
    IconChevronLeft,
    SettingsAside
  }
}
</script>