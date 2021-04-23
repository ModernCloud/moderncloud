<template>
  <div class="page">
    <div class="content">
      <div class="header">
        <div>
          <div class="title">Billing</div>
          <div class="subtitle">Manage your billing information and invoices</div>
        </div>
      </div>
      <p v-if="initialized === false">Loading...</p>
      <section class="with-divider">
        <h3>Current Plan</h3>
        <p>
          You are currently on Personal plan.<br />
          <router-link to="/settings/plans">Views plans and upgrade <IconArrowNarrowRight /></router-link>
        </p>
        <p>For questions about billing, contact <a href="mailto:contact@moderncloud.io">contact@moderncloud.io</a></p>
      </section>
      <section>
        <h3>Billing History</h3>
        <p>There are no invoices to display.</p>
      </section>
    </div>
  </div>
</template>

<script>
import IconArrowNarrowRight from "@/components/Icons/IconArrowNarrowRight";
export default {
  components: {IconArrowNarrowRight},
  data() {
    return {
      initialized: true
    }
  }
}
</script>