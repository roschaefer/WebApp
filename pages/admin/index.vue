<template>
  <section class="content">
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.users', 'Users') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="userCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.contributions', 'Contributions') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="contributionCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.comments', 'Comments') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="commentsCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.notifications', 'Notifications') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="notificationCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.organisations', 'Organizations') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="organizationCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.projects', 'Projects') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="projectCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.invites', 'Open Invites') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="inviteCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level under-construction">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.follows', 'Follows') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="followCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
      <div class="column level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ $t('component.admin.shouts', 'Shouts') }}</p>
            <p class="title">
              <count-to :startVal="0" :endVal="shoutCount" :duration="countDuration" :autoplay="true" separator="."></count-to>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import countTo from 'vue-count-to'

  export default {
    middleware: 'admin',
    layout: 'admin',
    components: {
      'count-to': countTo
    },
    head () {
      return {
        title: this.$t('component.admin.index_title')
      }
    },
    data () {
      return {
        countDuration: 2500,
        userCount: 0,
        contributionCount: 0,
        commentsCount: 0,
        organizationCount: 0,
        projectCount: 0,
        notificationCount: 0,
        emotionCount: 0,
        inviteCount: 0,
        followCount: 0,
        shoutCount: 0
      }
    },
    mounted () {
      this.$api.service('users').find({query: { $limit: 0 }})
        .then(res => {
          this.userCount = res.total || 0
        })
      this.$api.service('contributions').find({query: { $limit: 0 }})
        .then(res => {
          this.contributionCount = res.total || 0
        })
      this.$api.service('comments').find({query: { $limit: 0 }})
        .then(res => {
          this.commentsCount = res.total || 0
        })
      this.$api.service('organizations').find({query: { $limit: 0 }})
        .then(res => {
          this.organizationCount = res.total || 0
        })
      this.$api.service('projects').find({query: { $limit: 0 }})
        .then(res => {
          this.projectCount = res.total || 0
        })
      this.$api.service('notifications').find({query: { $limit: 0 }})
        .then(res => {
          this.notificationCount = res.total || 0
        })
      this.$api.service('emotions').find({query: { $limit: 0 }})
        .then(res => {
          this.emotionCount = res.total || 0
        })
      this.$api.service('invites').find({query: { $limit: 0, wasUsed: { $ne: true } }})
        .then(res => {
          this.inviteCount = res.total || 0
        })
      this.$api.service('follows').find({query: { $limit: 0 }})
        .then(res => {
          this.followCount = res.total || 0
        })
      this.$api.service('shouts').find({query: { $limit: 0 }})
        .then(res => {
          this.shoutCount = res.total || 0
        })
    }
  }
</script>

<style scoped lang="scss">

</style>
