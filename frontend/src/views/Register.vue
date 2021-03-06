<template>
  <div class="centered-content">
    <sui-segment raised>
      <h3>Modern Cloud</h3>
      <sui-form :loading="loading" @submit.prevent="submit" :error="hasError">
        <sui-message error>
          <p>{{errorMessage}}</p>
        </sui-message>
        <sui-form-field>
          <label>Name</label>
          <input type="text" v-model="form.name" />
        </sui-form-field>
        <sui-form-field>
          <label>Email</label>
          <input type="email" v-model="form.email" />
        </sui-form-field>
        <sui-form-field>
          <label>Password</label>
          <input type="password" v-model="form.password" />
        </sui-form-field>
        <sui-button fluid type="submit">Create account</sui-button>
        <sui-divider />
        <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
      </sui-form>
    </sui-segment>
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
        this.loading = false;
        this.hasError = true;
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