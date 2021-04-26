<template>
  <div class="page">
    <div class="content">
      <div class="header">
        <div>
          <div class="title">Billing</div>
          <div class="subtitle">Manage your billing information and invoices</div>
        </div>
      </div>
      <section class="with-divider">
        <h3>Current Plan</h3>
        <p v-if="subscriptionLoading">Loading...</p>
        <div v-if="subscriptionLoading === false && subscription">
          <p>
            You are currently on <strong style="font-weight: 500">{{packageName}}</strong> plan.<br />
            <router-link to="/settings/plans">Views plans and upgrade <IconArrowNarrowRight /></router-link>
          </p>
          <p>For questions about billing, contact <a href="mailto:contact@moderncloud.io">contact@moderncloud.io</a></p>
        </div>
      </section>
      <section>
        <h3>Billing History</h3>
        <p v-if="invoicesLoading">Loading...</p>
        <p v-if="invoicesLoading === false && invoices.length === 0">There are no invoices to display.</p>
        <table class="table table-bordered" v-if="invoicesLoading === false && invoices.length > 0">
          <thead>
            <tr>
              <th style="width: 130px;">#</th>
              <th style="text-align: right">Amount</th>
              <th style="text-align: center; width: 60px;">Status</th>
              <th style="text-align: right; width: 150px;">Due</th>
              <th style="text-align: right; width: 150px;">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in invoices" :key="invoice.number">
              <td><a :href="invoice.invoice_pdf" target="_blank">{{invoice.number}}</a></td>
              <td style="text-align: right">$ {{invoice.total}}</td>
              <td style="text-align: center;" class="text-success" v-if="invoice.is_paid">Paid</td>
              <td style="text-align: center" class="text-danger" v-if="invoice.is_paid === false">Unpaid</td>
              <td style="text-align: right">{{ parseDate(invoice.due_date) }}</td>
              <td style="text-align: right">{{ parseDate(invoice.created) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import IconArrowNarrowRight from "@/components/Icons/IconArrowNarrowRight";
import axios from "axios";
import moment from "moment";
export default {
  components: {IconArrowNarrowRight},
  data() {
    return {
      subscriptionLoading: true,
      invoicesLoading: true,
      invoices: [],
      subscription: null
    }
  },
  computed: {
    packageName() {
      let trial = ' (Trial)';
      return this.subscription.package_name + (this.subscription.is_trial ? trial : '');
    }
  },
  async mounted() {
    await this.loadSubscription();
    await this.loadInvoices();
  },
  methods: {
    async loadSubscription() {
      this.subscriptionLoading = true;
      try {
        let response = await axios.get('/api/auth/current-subscription');
        this.subscription = response.data.subscription;
      } catch (e) {
        console.log(e);
      }
      this.subscriptionLoading = false;
    },
    async loadInvoices() {
      this.invoicesLoading = true;
      try {
        let response = await axios.get('/api/auth/invoices');
        this.invoices = response.data.invoices;
      } catch (e) {
        console.log(e);
      }
      this.invoicesLoading = false;
    },
    parseDate(timestamp) {
      if (timestamp) {
        return moment.unix(timestamp).format('D MMM Y H:m:s');
      } else {
        return '-';
      }
    }
  }
}
</script>