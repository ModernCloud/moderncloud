<template>
  <div class="app">
    <settings-aside></settings-aside>
    <router-view></router-view>
  </div>
</template>

<script>
import SettingsAside from '../../components/Settings/SettingsAside.vue';

export default {
  components: {
    SettingsAside
  }
}
</script>