<template>
  <div class="centered-content">
    <div class="segment shadow-lg rounded">
      <h3>ModernCloud</h3>
      <form @submit.prevent="submit">
        <div class="alert alert-danger" v-if="hasError">{{errorMessage}}</div>
        <div class="mb-2">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" v-model="form.name" />
        </div>
        <div class="mb-2">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="form.email" />
        </div>
        <div class="mb-2">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" v-model="form.password" />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Create account
        </button>
        <div class="divider" style="margin: 10px 0;"></div>
        <p style="font-size: 13px; font-weight: 400;">Already have an account? <router-link to="/login">Sign in</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      hasError: false,
      errorMessage: null,
      loading: false,
      form: {
        name: null,
        email: null,
        password: null
      }
    }
  },
  methods: {
    async submit() {
      this.loading = true;
      this.hasError = false;
      try {
        let response = await axios.post('/api/auth/signup', this.form);
        this.$store.commit('login', response.data);
        this.$router.push('/');
      } catch (e) {
        if (e.response && e.response.data && e.response.data.error && e.response.data.error.details) {
          this.errorMessage = e.response.data.error.details[0].message;
        } else if (e.response && e.response.data && e.response.data.error && e.response.data.error.message) {
          this.errorMessage = e.response.data.error.message;
        } else {
          this.errorMessage = 'An error occurred!';
        }
        this.hasError = true;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.centered-content {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(108,58,180);
  background: linear-gradient(321deg, rgba(108,58,180,0.5536589635854341) 0%, rgba(253,29,47,0.5060399159663865) 50%, rgba(69,222,252,0.4948354341736695) 100%);

  .segment {
    background: #fff;
    margin-top: 50px;
    width: 400px;
    padding: 20px;

    h3 {
      text-align: center;
    }
  }
}
</style>