<template>
  <div class="centered-content">
    <div class="segment shadow-lg rounded">
      <h3>ModernCloud</h3>
      <form @submit.prevent="submit">
        <div class="alert alert-danger" v-if="hasError">Wrong email or password!</div>
        <div class="mb-2">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="form.email" />
        </div>
        <div class="mb-2">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" v-model="form.password" />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="loading">
          <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Sign in
        </button>
        <div class="divider" style="margin: 10px 0;"></div>
        <p style="font-size: 13px; font-weight: 400;">Don't have an account? <router-link to="/register">Sign up</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      hasError: false,
      loading: false,
      form: {
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
        let response = await axios.post('/api/auth/generate-token', this.form);
        this.$store.commit('login', response.data);
        this.$router.push('/');
      } catch (e) {
        this.hasError = true;
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
    background: rgb(17,30,48);
    background: linear-gradient(0deg, rgba(17,30,48,1) 0%, rgba(9,79,121,1) 22%, rgba(0,211,255,1) 100%);

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