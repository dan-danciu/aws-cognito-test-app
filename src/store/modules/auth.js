import axios from 'axios'
import { router } from '../../router'

const state = {
  profile: {
    name: 'John Doe',
    email: 'john.doe@webapp.link',
    image: '',
    user_id: '12345'
  },
  authentication: {
    access_token: null,
    date: null,
    expires_in: null
  },
  loading: false
}

const getters = {
  isAuthenticated: state => {
    return state.authentication.access_token !== null
  }
}

const mutations = {
  changeProfile (state, data) {
    state.profile = {
      ...state.profile,
      name: data.name,
      email: data.email,
      image: data.image,
      user_id: data.user_id
    }
  },
  changeToken (state, data) {
    state.authentication = {
      ...state.authentication,
      access_token: data["access_token"],
      date: data["date"],
      expires_in: data["expires_in"]
    }
  },
}

const actions = {
  setLogoutTimer ({dispatch}, expirationTime) {
    setTimeout(() => {
      dispatch('clearAuthData')
    }, expirationTime)
  },
  async authenticate ({ commit, state }, code) {
    state.loading = true
    await axios
      .post("https://cbf9bhx78g.execute-api.eu-west-1.amazonaws.com/dev/gettoken" + '?code=' + code)
      .then(response => {
        if(response.data["ok"] === "true") {
          commit('changeToken', response.data)
          localStorage.setItem('access_token', response.data["access_token"])
          localStorage.setItem('date', response.data["date"])
          localStorage.setItem('expires_in', response.data["expires_in"])
          router.push({name: 'home'})
        }
      })
    state.loading = false
  },
  tryAutoLogin ({ dispatch }) {
    const token =  localStorage.getItem('access_token')
    //to be continued
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
