<template>
  <button v-if="type === 'button'" :class="classes" @click="click">
    <slot></slot>
  </button>
  <nuxt-link v-else-if="type === 'nuxt'" :class="classes" :to="to">
    <slot></slot>
  </nuxt-link>
  <a v-else :class="classes" @click="click">
    <slot></slot>
  </a>
</template>

<script>
  /**
   * Renders a nice and smooth button element.
   */
  export default {
    name: 'hc-button',
    props: {
      /**
       * Set color: primary, dark, light, success, info, danger, warning
       */
      color: {
        type: String,
        default: 'primary'
      },
      /**
       * Render as a circle: true | false
       */
      circle: {
        type: Boolean,
        default: false
      },
      /**
       * Set loading state: true | false
       */
      loading: {
        type: Boolean,
        default: false
      },
      /**
       * Set size: xsmall, small, medium, large
       */
      size: {
        type: String,
        default: ''
      },
      /**
       * Pass a to parameter (Only for type "nuxt")
       */
      to: {
        type: [String, Object],
        default: ''
      },
      /**
       * Set type: button, link, nuxt
       */
      type: {
        type: String,
        default: 'button'
      }
    },
    computed: {
      classes () {
        let classes = 'button'
        if (this.color) {
          classes += ` is-${this.color}`
        }
        if (this.circle) {
          classes += ' is-circle'
        }
        if (this.loading) {
          classes += ' is-loading'
        }
        if (this.size) {
          classes += ` is-${this.size}`
        }
        return classes
      }
    },
    methods: {
      click (event) {
        this.$emit('click', event)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~assets/styles/utilities";
  @import "~bulma/sass/elements/button.sass";

  .is-xsmall {
    font-size: $size-xsmall;
  }

  .is-circle {
    border-radius: 100% !important;
    width: 2.25em;
    height: 2.25em;

    &.is-medium {
      width: 2.7em;
      height: 2.7em;
    }

    &.is-large {
      width: 3.2em;
      height: 3.2em;
    }
  }
</style>