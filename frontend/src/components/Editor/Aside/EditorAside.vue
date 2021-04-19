<template>
  <aside id="editor-aside">
    <section class="brand">
      <router-link to="/" class="name">
      <img src="../../../assets/img/logo.png" height="19" v-if="$store.state.account.settings.theme === 'light'" />
      <img src="../../../assets/img/logo_dark.png" height="19" v-if="$store.state.account.settings.theme === 'dark'" />
      </router-link>
    </section>
    <perfect-scrollbar class="modules" :options="{suppressScrollX: true}">
        <Endpoints />
        <Functions />
        <DynamoDB />
    </perfect-scrollbar>
    <Footer />
  </aside>
</template>

<script>
import Endpoints from './Endpoints.vue';
import Functions from './Functions.vue';
import DynamoDB from "./DynamoDB.vue";
import Footer from "./Footer.vue";

export default {
  components: {
    DynamoDB,
    Endpoints,
    Functions,
    Footer
  }
}
</script>