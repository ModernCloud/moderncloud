<template>
  <aside>
    <div style="padding-top: 10px; padding-left: 10px;">
      <sui-accordion exclusive fluid>
        <Endpoints />
        <Functions />
        <Packages />
      </sui-accordion>
    </div>
  </aside>
</template>

<script>
import Endpoints from './Endpoints.vue';
import Functions from './Functions.vue';
import Packages from './Packages.vue';

export default {
  components: {
    Endpoints,
    Functions,
    Packages
  }
}
</script>