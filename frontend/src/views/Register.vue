<template>
  <div id="register">
    <div></div>
    <div class="segment shadow-lg">
      <section>
        <h3>Modern Cloud</h3>
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
      </section>
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
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#register {
  height: 100%;
  display: grid;
  background: rgb(239, 239, 239);
  grid-template-columns: 1fr 600px;
  grid-template-rows: auto;

  .segment {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    section {
      flex-grow: 1;
      padding: 0 80px;
    }

    h3 {
      text-align: center;
      color: rgb(29, 53, 87);
      font-size: 35px;
      font-family: Edition, serif;
    }
  }
}
</style>