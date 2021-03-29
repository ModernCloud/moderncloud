<template>
  <aside id="editor-aside">
    <section class="brand">
      <router-link to="/" class="name">Modern Cloud</router-link>
    </section>
    <perfect-scrollbar class="modules" :options="{suppressScrollX: true}">
        <Endpoints />
        <Functions />
        <Packages />
        <DynamoDB />
    </perfect-scrollbar>
    <Footer />
  </aside>
</template>

<script>
import Endpoints from './Endpoints.vue';
import Functions from './Functions.vue';
import Packages from './Packages.vue';
import DynamoDB from "./DynamoDB.vue";
import Footer from "./Footer.vue";

export default {
  components: {
    DynamoDB,
    Endpoints,
    Functions,
    Packages,
    Footer
  }
}
</script>