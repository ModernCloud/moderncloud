<template>
  <div class="page">
    <div class="content">
      <div class="header">
        <div>
          <div class="title">Account</div>
          <div class="subtitle">Update your account information</div>
        </div>
      </div>
      <p v-if="initialized === false">Loading...</p>
      <form @submit.prevent="submit" v-if="initialized">
        <div v-if="hasError" class="alert alert-danger">An error occurred!</div>
        <div class="mb-2">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" v-model="form.name" />
        </div>
        <div class="mb-2">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="form.email" />
        </div>
        <div class="mb-2">
          <label class="form-check-label">
            <input type="checkbox" v-model="showPasswordField" />
            Change Password
          </label>
        </div>
        <div class="mb-2" v-if="showPasswordField">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" v-model="form.password" />
        </div>
        <div>
          <button type="submit" class="btn btn-primary" @click="submit" :disabled="loading">
            <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      initialized: false,
      loading: true,
      hasError: false,
      showPasswordField: false,
      form: {
        name: null,
        email: null,
        password: null
      }
    }
  },
  async mounted() {
    await this.loadUser();
  },
  methods: {
    async loadUser() {
      this.loading = true;
      try {
        let response = await axios.get('/api/auth/my-info');
        this.form.name = response.data.user.name;
        this.form.email = response.data.user.email;
      } catch (e) {
        console.log(e);
        this.hasError = true;
      } finally {
        this.initialized = true;
        this.loading = false;
      }
    },
    async submit() {
      this.loading = true;
      this.hasError = false;
      try {
        let response = await axios.post('/api/auth/my-info', this.form);
        this.$store.commit('updateUser', response.data);
      } catch (e) {
        this.hasError = true;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>