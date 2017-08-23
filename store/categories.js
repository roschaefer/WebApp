import feathers from '~plugins/feathers'

const categoriesService = feathers.service('categories')

export const state = () => {
  return {
    categories: false
  }
}

export const mutations = {
  set (state, categories) {
    if (!categories || categories === undefined) {
      state.categories = null
    } else {
      state.categories = categories
    }
  }
}

export const getters = {
  all (state) {
    return state.categories
  }
}

export const actions = {
  // Called from nuxtServerInit in index
  init ({dispatch}) {
    return dispatch('fetch')
  },
  // Called from plugins/init-store-subscriptions only once
  subscribe ({dispatch}) {
    return categoriesService
      .on('created', () => {
        dispatch('fetch')
      })
  },
  fetch ({commit}) {
    return categoriesService.find({
      query: {
        '$limit': 200,
        '$sort': {
          slug: 1
        }
      }
    })
      .then((result) => {
        commit('set', result.data)
      })
      .catch(() => {
        commit('clear')
      })
  },
  add ({dispatch}, category) {
    return categoriesService.create(category)
  }
}