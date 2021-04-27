<template>
  <div class="page">
    <div class="content" style="max-width: 700px;">
      <div class="header">
        <div>
          <div class="title">Plans</div>
          <div class="subtitle">You are currently on Personal plan.</div>
        </div>
      </div>
      <p v-if="initialized === false">Loading...</p>
      <section>
        <div class="pricing">
          <div class="price-columns">
            <div class="price-column">
            </div>
            <div class="price-column">
              <h2>Personal</h2>
              <div class="price">$8</div>
              <p>Best for your personal projects</p>
              <a href="javascript:;" class="btn disabled">Current Plan</a>
            </div>
            <div class="price-column">
              <h2>Team</h2>
              <div class="price">$18 / person</div>
              <p>Best for teams building and working together</p>
              <a href="javascript:;" class="btn">Coming Soon</a>
            </div>
            <div class="price-column">
              <h2>Enterprise</h2>
              <div class="price">Custom pricing</div>
              <p>Deploy ModernCloud to your own servers</p>
              <a href="mailto:contact@moderncloud.io" class="btn">Contact</a>
            </div>
          </div>
          <div class="detail-columns desktop-mode">
            <div class="detail-column">
              <div class="item">Endpoints</div>
              <div class="item">Functions</div>
              <div class="item">Databases</div>
              <div class="item">Github integration</div>
              <div class="item">SSO (Single Sign-On)</div>
              <div class="item">Support</div>
            </div>
            <div class="detail-column">
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item">Not Supported</div>
              <div class="item">Not Supported</div>
              <div class="item">Community Support</div>
            </div>
            <div class="detail-column">
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Included</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Included</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Priority Support</div>
            </div>
            <div class="detail-column">
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Unlimited</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Included</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Included</div>
              <div class="item"><IconCheck class="active" :stroke-width="1.5" /> Dedicated Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import IconCheck from "@/components/Icons/IconCheck";
export default {
  components: {IconCheck},
  data() {
    return {
      initialized: true
    }
  }
}
</script>