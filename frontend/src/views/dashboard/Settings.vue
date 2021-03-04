<template>
  <div class="app">
    <app-header></app-header>
    <settings-aside></settings-aside>
    <router-view></router-view>
  </div>
</template>

<script>
import AppHeader from '../../components/Settings/Header.vue';
import SettingsAside from '../../components/Settings/SettingsAside.vue';

export default {
  components: {
    AppHeader,
    SettingsAside
  }
}
</script>