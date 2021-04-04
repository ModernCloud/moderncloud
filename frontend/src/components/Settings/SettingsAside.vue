<template>
  <aside id="settings-aside">
    <section class="brand">
      <router-link to="/" class="name"><img src="../../assets/img/logo.png" height="19" /></router-link>
    </section>
    <section class="links">
      <router-link to="/settings/account" active-class="active">
        <IconUser :width="18" :height="18" :stroke-width="1.3" />
        Account
      </router-link>
      <router-link to="/settings/billing" active-class="active">
        <IconCreditCard :width="18" :height="18" :stroke-width="1.3" />
        Billing
      </router-link>
      <router-link to="/settings/projects" active-class="active">
        <IconLayers :width="18" :height="18" :stroke-width="1.3" />
        Projects
      </router-link>
      <a href="javascript:;" @click="logout" class="logout">Logout</a>
    </section>
  </aside>
</template>

<script>
import IconLayers from "@/components/Icons/IconLayers";
import IconCreditCard from "@/components/Icons/IconCreditCard";
import IconUser from "@/components/Icons/IconUser";
export default {
  components: {IconUser, IconCreditCard, IconLayers},
  methods: {
    logout() {
      this.$store.commit('logout');
      this.$store.commit('clearSelectedProject');
      this.$router.push({path: '/login'});
    }
  }
}
</script>