<template>
  <div class="page">
    <div class="content">
      <div class="header">
        <div>
          <div class="title">Preferences</div>
          <div class="subtitle">Update your ModernCloud preferences</div>
        </div>
      </div>
      <section class="preference">
        <h3>Theme</h3>
        <p>Select your interface scheme</p>
        <div class="btn-group">
          <a href="javascript:;" class="btn" @click="$store.commit('changeTheme', 'light')">
            <IconSun /> Light
          </a>
          <a href="javascript:;" class="btn" @click="$store.commit('changeTheme', 'dark')">
            <IconMoon /> Dark
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import IconSun from '@/components/Icons/IconSun.vue';
import IconMoon from '@/components/Icons/IconMoon.vue';

export default {
  components: {IconSun, IconMoon}
}
</script>