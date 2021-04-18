<template>
  <div id="register">
    <div></div>
    <div class="segment">
      <section>
        <div class="header">
          <h1>Welcome to</h1>
          <img src="../assets/img/logo.png" height="24" />
        </div>
        <form @submit.prevent="submit">
          <div class="alert alert-danger" v-if="hasError">{{errorMessage}}</div>
          <div class="mb-3">
            <input type="text" class="form-control" v-model="form.name" placeholder="Enter your name" />
          </div>
          <div class="mb-3">
            <input type="email" class="form-control" v-model="form.email" placeholder="Enter your email" />
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" v-model="form.password" placeholder="Enter your password" />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
            <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Create account
          </button>
          <button type="button" class="btn btn-primary" style="width: 100%; margin-top: 5px;" :disabled="loading" @click="continueWithGoogle">
            <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Continue with Google
          </button>
          <div class="divider" style="margin: 30px 0;"></div>
          <p style="text-align: center">Already have an account? <router-link to="/login">Sign in</router-link></p>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import firebase from "firebase";

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
  mounted() {
    this.$store.commit('changeTheme', 'light');
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
#register {
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