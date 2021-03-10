<template>
  <aside id="settings-aside">
    <div>
      <section class="title" @click="$router.push('/')">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="32" height="32" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="5" y1="12" x2="19" y2="12" /><line x1="5" y1="12" x2="9" y2="16" /><line x1="5" y1="12" x2="9" y2="8" /></svg>
        <div class="name">Settings</div>
      </section>
      <section class="links">
        <router-link to="/settings/account" active-class="active">Account</router-link>
        <router-link to="/settings/billing" active-class="active">Billing</router-link>
        <router-link to="/settings/projects" active-class="active">Projects</router-link>
      </section>
    </div>
  </aside>
</template>

<script>
</script>