<template>
  <section class="container content">
    <div class="card">
      <div class="card-content">
        <div class="card-teaser">
          <nuxt-link to="/"><img src="/logo-vertical.svg" alt="Human Connection" class="logo"/></nuxt-link>
        </div>
        <p class="subtitle is-6">Wenn du einen Account bei Human Connection besitzt, logge dich bitte hier ein.</p>
        <form @submit.prevent="login">
          <div class="field">
            <p class="control has-icons-right">
              <input class="input" v-bind:class="{ 'is-danger': errors }" type="text" placeholder="Email"
                     v-model="data.email">
              <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-right">
              <input class="input" v-bind:class="{ 'is-danger': errors }" type="password" placeholder="Password"
                     v-model="data.password">
              <span v-if="errors" class="icon is-small is-right">
                              <i class="fa fa-warning"></i>
                            </span>
            </p>
          </div>
          <div class="field has-text-left">
            <b-switch v-model="stayLoggedIn">Stay logged in</b-switch>
          </div>
          <hc-button color="primary" size="medium" type="button" class="is-fullwidth" :loading="loading">
            Login
          </hc-button>
        </form>
      </div>
      <footer class="card-footer">
        <nuxt-link :to="{ name: 'auth-register' }" class="card-footer-item">
          Noch kein Konto?
        </nuxt-link>
        <a href="" class="card-footer-item">
          Passwort vergessen?
        </a>
      </footer>
    </div>
  </section>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    middleware: 'anonymous',
    layout: 'blank',
    data () {
      return {
        data: {
          email: '',
          password: ''
        },
        loading: false,
        stayLoggedIn: false,
        errors: null
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    methods: {
      hello () {
        console.log('hello')
      },
      async login (e) {
        e.preventDefault()
        this.errors = false
        this.loading = true
        this.$store.dispatch('auth/login', this.data)
          .then(() => {
            this.$toast.open({
              message: 'congratulations, you are in!',
              duration: 3000,
              type: 'is-success'
            })
            this.loading = false
            this.data.password = null
            this.$router.replace(this.$route.query.path || '/')
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
            this.errors = true
            this.loading = false
          })
      }
    },
    head () {
      return {
        title: 'Login'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card {
    margin: 0 auto;
    max-width: 460px;
    text-align: center;
  }

  .subtitle {
    margin-top: 30px;
  }

  .card-teaser {
    padding-top: 10px;

    img {
      display: inline-block;
      max-width: 200px;
      height: auto;
    }
  }

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>