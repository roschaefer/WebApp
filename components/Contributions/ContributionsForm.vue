<template>
  <form v-bind:disabled="isLoading">
    <!-- ToDo remove :test="true" for production -->
    <hc-upload :previewImage="form.teaserImg"
               :test="true"
               @update="value => { form.teaserImg = value }"
               @start-sending="uploadingCover = true"
               @stop-sending="uploadingCover = false"
               style="margin: -3.8rem -2.25rem 2.25rem;">
    </hc-upload>
    <div class="columns">
      <div class="column">
        <author :user="user" />
      </div>
      <div class="column"></div>
    </div>
    <hr/>
    <div class="tabs is-toggle is-toggle-rounded is-centered" :class="{ disabled: form._id }">
      <ul>
        <li v-for="(postType, index) in options.postTypes"
            :class="{ 'is-active': postType.active, 'under-construction': postType.disabled }"
            :key="index">
          <a :disabled="postType.disabled"
            @click="setPostType(index)">
            <span class="icon">
              <hc-icon :icon="'tools-'+postType.value" set="hc" />
            </span>
            <span>{{ postType.label }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="field">
      <label class="label">{{ $t('component.contribution.writePostSection') }}</label>
      <p class="control">
        <input class="input"
               v-model="form.title"
               type="text"
               v-bind:placeholder="$t('component.contribution.writePostSectionPlaceholder')"
               v-bind:disabled="isLoading">
      </p>
    </div>
    <div class="tags">
      <div v-for="(file, index) in dropFiles"
            :key="index"
            class="tag is-primary" >
          {{file.name}}
          <button class="delete is-small"
                  type="button"
                  @click="deleteDropFile(index)">
          </button>
      </div>
    </div>
    <div class="field">
      <label class="label">{{ $t('component.contribution.writePostContent') }}</label>
      <div class="control">
        <hc-editor identifier="content"
          v-model="form.content"
          :loading="isLoading"
          :editorOptions="editorOptions"/>
      </div>
    </div>
    <hr/>
    <div v-if="form.type === 'cando'">
      <div class="field">
        <label class="label">{{ $t('component.contribution.difficultyDescription') }}</label>
        <p class="control">
          <b-radio v-for="difficulty in options.difficulties"
            :key="difficulty" :native-value="difficulty"
            v-model="form.cando.difficulty">
              {{ $t(`difficulty.${difficulty}`) }}
          </b-radio>
        </p>
      </div>
      <hr/>
      <div class="field">
        <label class="label">{{ $t('component.contribution.canDoReasonTitle') }}</label>
        <p class="control has-margin-bottom-medium">
          <input class="input"
                 v-model="form.cando.reasonTitle"
                 type="text"
                 v-bind:placeholder="$t('component.contribution.canDoReasonTitlePlaceholder')"
                 v-bind:disabled="isLoading">
        </p>
      </div>
      <div class="field">
        <label class="label">{{ $t('component.contribution.canDoReasonContent') }}</label>
        <div class="control">
          <hc-editor identifier="cando-reason"
            v-model="form.cando.reason"
            :loading="isLoading"
            :editorOptions="editorOptions2"/>
        </div>
      </div>
      <hr/>
    </div>
    <div class="field">
      <label class="label">{{ $t('component.category.labelLongOnePluralNone', null, 2) }}</label>
      <categories-select v-model="form.categoryIds" :disabled="isLoading"></categories-select>
    </div>
    <hr/>
    <no-ssr>
      <div class="field">
        <b-field label="Tags">
          <b-taginput
              maxtags="5"
              size="is-small"
              :value="form.tags"
              icon=""
              placeholder="Add a tag"
              @keyup.delete.native="onTagDelete"
              @keydown.tab.native="onTagTab">
          </b-taginput>
        </b-field>
      </div>
    </no-ssr>
    <br/>
    <hr/>

    <div class="level">
      <div class="level-item">
        <div class="field">
          <div class="is-normal">
            <label class="label">{{ $t('component.contribution.language') }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control has-icons-left">
                <div class="select">
                  <select v-model="form.language">
                    <option value="de" selected>Deutsch</option>
                    <option value="en">English</option>
                  </select>
                  <div class="icon is-small is-left">
                    <i class="fa fa-globe"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="level-item">
        <div class="field">
          <div class="is-normal">
            <label class="label">{{ $t('component.contribution.visibility') }}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control has-icons-left">
                <div class="select">
                  <select v-model="form.visibility">
                    <option value="public" selected>Public</option>
                    <option value="friends">Friends only</option>
                    <option value="private">Private</option>
                  </select>
                  <div class="icon is-small is-left">
                    <i class="fa fa-eye"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    <no-ssr>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <button class="button has-text-grey is-white" @click.prevent="$router.back()">
            <i class="fa fa-times"></i>
            &nbsp;{{ $t('button.cancel') }}
          </button>
        </div>
        <div class="control">
          <hc-button :isLoading="isLoading"
                     :disabled="disabled"
                     @click.prevent="onSubmit">
            <i class="fa fa-check"></i>
            &nbsp;<span>{{ buttonPublishLabel }}</span>
          </hc-button>
        </div>
      </div>
    </no-ssr>
  </form>
</template>

<script>
  import CategoriesSelect from '~/components/Categories/CategoriesSelect.vue'
  import Author from '~/components/Author/Author.vue'
  import {mapGetters} from 'vuex'
  import validUrl from 'valid-url'
  import ContributionImage from '~/components/Contributions/ContributionImage.vue'
  import EditorMentions from '~/components/Mentions/EditorMentions'
  import { isEmpty } from 'lodash'

  export default {
    name: 'hc-contributions-form',
    props: ['data'],
    components: {
      Author,
      CategoriesSelect,
      ContributionImage,
      EditorMentions
    },
    head () {
      return {
        title: this.$t('component.contribution.writePost')
      }
    },
    data () {
      // const i18nEditorLinkEnterUrl = this.$t('component.editor.linkEnterUrl')
      // const i18nEditorVideoEnterUrl = this.$t('component.editor.videoEnterUrl')
      const i18nEditorPlaceholder = this.$t('component.contribution.writePostContentPlaceholder')
      const i18nEditor2Placeholder = this.$t('component.contribution.canDoReasonContentPlaceholder')
      return {
        editorReady: false,
        isLoading: false,
        uploadingCover: false,
        dropFiles: null,
        form: {
          _id: null,
          type: 'post',
          teaserImg: null,
          title: '',
          content: '',
          language: this.$i18n.locale(),
          visibility: 'public',
          categoryIds: [],
          tags: [],
          attachments: [],
          cando: {
            difficulty: null,
            reasonTitle: null,
            reason: null
          },
          ...this.data
        },
        options: {
          languages: [],
          visibilities: [],
          topics: [],
          tags: [],
          postTypes: [
            {
              label: 'Post',
              value: 'post',
              active: true,
              disabled: false
            },
            {
              label: 'Can Do',
              value: 'cando',
              active: false,
              disabled: false
            }/* ,
            {
              label: 'Pro / Con',
              value: 'procon',
              active: false,
              disabled: true
            } */
          ],
          difficulties: ['easy', 'medium', 'hard']
        },
        editorOptions: {
          placeholder: i18nEditorPlaceholder
        },
        editorOptions2: {
          placeholder: i18nEditor2Placeholder
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      buttonPublishLabel () {
        return this.form._id ? this.$t('button.update') : this.$t('button.publish')
      },
      disabled () {
        return !!this.uploadingCover
      }
    },
    methods: {
      setPostType (newIndex) {
        this.options.postTypes.forEach((postType, index) => {
          if (index === newIndex) {
            postType.active = true
            this.form.type = postType.value
          } else {
            postType.active = false
          }
        })
      },
      isValidURL (url) {
        return !!validUrl.isWebUri(url)
      },
      deleteDropFile (index) {
        this.dropFiles.splice(index, 1)
      },
      async onSubmit () {
        this.isLoading = true

        try {
          let formData = Object.assign({}, this.form)
          if (formData.type !== 'cando') {
            delete formData.cando
          }
          let res = null
          if (this.form._id) {
            res = await this.$api.service('contributions').patch(formData._id, formData)
          } else {
            res = await this.$api.service('contributions').create(formData)
          }
          this.$store.commit('newsfeed/clear')
          this.$snackbar.open({
            message: this.$t('component.contribution.messageSaveSuccess'),
            duration: 4000,
            type: 'is-success'
          })
          this.$router.push(`/contributions/${res.slug}?refresh=true`)
        } catch (err) {
          console.error(err)
          this.isLoading = false
          this.$toast.open({
            message: err.message,
            type: 'is-danger'
          })
        }
      },
      onTagDelete (e) {
        if (isEmpty(e.target.value)) {
          this.form.tags.pop()
        }
      },
      onTagTab (e) {
        if (!isEmpty(e.target.value)) {
          setTimeout(() => {
            e.target.focus()
          }, 20)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .textarea {
    margin-bottom: 10px;
    min-height: 80px;
  }

  .field .taginput .taginput-container.is-focusable {
    border: 1px solid $grey-lighter !important;
    box-shadow: none !important;
  }

  a[disabled] {
    pointer-events: none;
  }

  .tabs {
    &.disabled {
      pointer-events: none;
      opacity: .5;
    }
  }
</style>
