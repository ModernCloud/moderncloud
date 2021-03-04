<template>
  <aside>
    <div style="padding-top: 10px; padding-left: 10px; padding-right: 10px;">
      <sui-button style="margin-bottom: 4px;" fluid basic @click="$router.push('/settings/account');" :active="$route.path.indexOf('/settings/account') > -1">Account</sui-button>
      <sui-button fluid basic @click="$router.push('/settings/projects');" :active="$route.path.indexOf('/settings/projects') > -1">Projects</sui-button>
    </div>
  </aside>
</template>

<script>
</script>