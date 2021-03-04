<template>
  <router-view></router-view>
</template>

<script>

export default {
}
</script>

<style lang="scss">
  html, body {
    height: 100%;
    margin: 0;
    font-family: sans-serif;
    overflow: hidden;
  }

  .app {
    height: 100%;
    display: grid;
    grid-template-rows: auto 42px 1fr;
    grid-template-columns: auto 1fr;
  }

  header {
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .16);
    /* stretch from first grid line to last grid line */
    grid-column: 1/-1;
    -ms-grid-column-span: 2;
    grid-row: 2;
    border-bottom: 1px solid #ddd;
  }

  aside {
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .16);
    border-right: 1px solid #ddd;
    grid-row: 3;
    grid-column: 1;
    width: 250px;
    overflow-y: auto;
  }

  @media (max-width: 992px) {
    aside {
      width: 64px;
    }
  }

  [role=main] {
    grid-row: 3;
    grid-column: 2;
    height: 100%;
    overflow-y: auto;
  }
</style>