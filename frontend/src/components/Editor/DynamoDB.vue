<template>
  <div>
    <sui-accordion-title is="sui-menu-header" active>
      <sui-icon name="dropdown" />
      DynamoDB
    </sui-accordion-title>
    <sui-accordion-content active style="font-size: 12px; padding-left: 10px;">
      <div style="margin-bottom: 10px;"><a href="javascript:;"><sui-icon name="plus square" outline /> New Table</a></div>
      <sui-icon name="spinner" loading v-if="loading" />
    </sui-accordion-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  }
}
</script>