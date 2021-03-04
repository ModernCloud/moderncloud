<template>
  <div class="centered-content">
    <sui-segment raised>
      <h3>ModernCloud</h3>
      <sui-form :loading="loading" @submit.prevent="submit" :error="hasError">
        <sui-message error>
          <p>Wrong email or password!</p>
        </sui-message>
        <sui-form-field>
          <label>Email</label>
          <input type="email" v-model="form.email" />
        </sui-form-field>
        <sui-form-field>
          <label>Password</label>
          <input type="password" v-model="form.password" />
        </sui-form-field>
        <sui-button fluid type="submit">Sign in</sui-button>
        <sui-divider />
        <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
      </sui-form>
    </sui-segment>
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
    display: flex;
    margin-top: 50px;
    min-height: 500px;
    align-items: center;
    justify-content: center;

    .segment {
      width: 400px;

      h3 {
        text-align: center;
      }
    }
  }
</style>