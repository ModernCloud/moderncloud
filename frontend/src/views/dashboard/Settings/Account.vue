<template>
  <div role="main">
    <sui-form style="padding: 20px;" :loading="loading" @submit.prevent="submit" :error="hasError">
      <sui-message error>
        <p>An error occurred!</p>
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
        <sui-checkbox v-model="showPasswordField" label="Change Password" />
      </sui-form-field>
      <sui-form-field v-if="showPasswordField">
        <label>Password</label>
        <input type="password" v-model="form.password" />
      </sui-form-field>
      <sui-button type="submit">Submit</sui-button>
    </sui-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
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
      } finally {
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