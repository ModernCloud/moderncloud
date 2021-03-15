<template>
  <div class="centered-content">
    <div class="segment shadow-lg rounded">
      <h3>Modern Cloud</h3>
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
    box-shadow: 0 30px 100px rgb(29, 53, 87);
    background: rgb(168, 218, 220);
    background: linear-gradient(0deg, rgba(168, 218, 220) 10%, rgba(168, 218, 220, .5) 100%);

    .segment {
      background: #fff;
      margin-top: 50px;
      width: 400px;
      padding: 20px;

      h3 {
        text-align: center;
        color: rgb(29, 53, 87);
        font-size: 35px;
        margin-bottom: 30px;
        font-family: Edition, serif;
      }
    }
  }
</style>