<template>
  <div id="login">
    <div class="segment">
      <section>
        <div class="header">
          <h1>Welcome back to</h1>
          <img src="../assets/img/logo.png" height="24" />
        </div>
        <form @submit.prevent="submit">
          <div class="alert alert-danger" v-if="hasError">Wrong email or password!</div>
          <div class="mb-3">
            <input type="email" class="form-control" v-model="form.email" placeholder="Enter your email" />
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" v-model="form.password" placeholder="Enter your password" />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
            <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Sign in
          </button>
          <button type="button" class="btn btn-primary" style="width: 100%; margin-top: 5px;" :disabled="loading" @click="continueWithGoogle">
            <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Continue with Google
          </button>
          <div class="divider" style="margin: 20px 0;"></div>
          <p style="text-align: center">Don't have an account? <router-link to="/register">Sign up</router-link></p>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
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
    },
    continueWithGoogle() {
      this.loading = true;
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      firebase.auth().signInWithPopup(provider)
        .then(result => {
          return result.user.getIdToken();
        }).then(idToken => {
          return axios.post('/api/auth/verify-google', {id_token: idToken});
        }).then(response => {
          this.$store.commit('login', response.data);
          this.$router.push('/');
        }).catch((error) => {
          console.log(error);
        }).finally(() => {
          this.loading = false;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .segment {
    width: 500px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    section {
      flex-grow: 1;
      padding: 0 80px;

      .header {
        text-align: center;
        margin-bottom: 30px;

        h1 {
          font-size: 18px;
          font-weight: 500;
        }
      }

      .form-control, .btn {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }
}
</style>