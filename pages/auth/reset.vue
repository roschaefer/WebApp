<template>
  <section class="container content">
    <div class="card" :class="classes">
      <div class="card-content">
        <hc-flag-switch />
        <div class="card-teaser">
          <nuxt-link :to="$route.params.path || '/'">
            <img src="/assets/images/registration/humanconnection.svg" alt="Human Connection"/>
          </nuxt-link>
        </div>
        <h6 class="subtitle is-6">{{ $t('auth.reset.description') }}</h6>
        <form @submit.prevent="login">
          <div class="field">
            <div class="control has-icons-right">
              <input ref="focus"
                     name="username"
                     type="email"
                     autofocus
                     :class="{ 'input': true, 'is-danger': $v.form.email.$error }"
                     :placeholder="$t('auth.account.email')"
                     v-model.trim="form.email"
                     @blur="$v.form.email.$touch">
              <span v-if="$v.form.email.$error" class="icon is-small is-right">
                <i class="fa fa-warning"></i>
              </span>
            </div>
          </div>
          <hc-button color="primary"
                     name="submit"
                     @click.prevent="doReset"
                     size="medium"
                     type="button"
                     class="is-fullwidth"
                     :isLoading="isLoading"
                     :disabled="$v.form.$invalid">
            {{ $t('auth.reset.label') }}
          </hc-button>
        </form>
      </div>
      <footer class="card-footer">
        <nuxt-link :to="{ name: 'auth-register', params: { path: this.$route.params.path } }" class="card-footer-item">
          {{ $t('auth.register.noAccountYet') }}
        </nuxt-link>
      </footer>
    </div>
  </section>
</template>

<script>
  import animatable from '~/components/mixins/animatable'
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'
  import FlagSwitch from '~/components/Auth/FlagSwitch'

  export default {
    layout: 'blank',
    components: {
      'hc-flag-switch': FlagSwitch
    },
    mixins: [animatable, validationMixin],
    data () {
      return {
        form: {
          email: ''
        },
        isLoading: false
      }
    },
    validations () {
      return {
        form: {
          email: {
            required,
            email
          }
        }
      }
    },
    methods: {
      doReset () {
        if (this.$v.form.$invalid) {
          this.animate('shake')
          this.isLoading = false
          return
        }
        this.isLoading = true
        this.$store.dispatch('auth/resetpass', this.form)
          .then((res) => {
            console.log(res)
            this.$snackbar.open({
              message: this.$t('auth.reset.successInfo'),
              duration: 4000,
              type: 'is-success'
            })
            this.$router.push('/auth/login')
          })
          .catch(err => {
            this.isLoading = false
            this.$toast.open({
              message: err.message,
              type: 'is-danger'
            })
            this.animate('shake')
          })
      }
    },
    head () {
      return {
        title: this.$t('auth.reset.label')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";
  @import "assets/styles/_animations";

  .card {
    margin: 0 auto;
    max-width: 460px;
    text-align: center;
    border: none;
    box-shadow: $card-shadow;
  }

  .subtitle {
    margin-top: 30px;
  }

  .card-teaser {
    img {
      display: inline-block;
      max-width: 200px;
      height: auto;

      @include tablet {
        max-width: 260px;
      }
    }
  }

  form {
    margin: 1em auto;
    padding: 1em;
    text-align: left;
  }
</style>
