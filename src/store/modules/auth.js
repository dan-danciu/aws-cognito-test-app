import axios from 'axios'
import { router } from '../../router'

const state = {
  profile: {
    name: 'John Doe',
    email: 'john.doe@webapp.link',
    image: '',
    user_id: '12345'
  },
  id_token: null,
  auth2: null,
  loading: false
}

const getters = {
  isAuthenticated: state => {
    return state.id_token !== null
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
  changeToken (state, token) {
    state.id_token = token
  },
  auth2Object (state, auth2) {
    state.auth2 = auth2
  },
  clearAuth (state) {
    state.profile = {}
    state.id_token = null
    state.auth2 = null
  }
}

const actions = {
  setLogoutTimer ({dispatch}, expirationTime) {
    setTimeout(() => {
      dispatch('clearAuthData')
    }, expirationTime)
  },
  gAuth ({ commit, dispatch }, fresh) {
    window.gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      const auth2 = window.gapi.auth2.init({
        client_id: '260183799410-3agediepvbmo0n1j23jk4se5jkgnm382.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      })
      commit('auth2Object', auth2)
      if (fresh) {
        dispatch('attachSignin', document.getElementById('customBtn'))
      }
      else {
        const token =  localStorage.getItem('token')
        dispatch('setToken', token)
        dispatch('authenticate', token)
      }
    })

  },
  attachSignin ( {commit, dispatch }, element) {
    state.auth2.attachClickHandler(element, {},
        function(googleUser) {
          const token = googleUser.getAuthResponse().id_token
          const expires = googleUser.getAuthResponse().expires_in
          //vm.$emit('authenticated', {'id_token':vm.id_token, 'auth':vm.auth2});
          //eventBus.$emit('authenticated', {'id_token':vm.id_token, 'auth2':vm.auth2});
          const now = new Date()
          const expirationDate = new Date(now.getTime() + expires * 1000)
          localStorage.setItem('expirationDate', expirationDate)
          commit('changeToken', token)
          localStorage.setItem('token', token)
          dispatch('authenticate', token)
          dispatch('setLogoutTimer', expires * 1000)
          //vm.authenticate();
        }, function(error) {
          alert(JSON.stringify(error, null, 2))
        })
  },
  authenticate ({ commit, state }, token) {
    state.loading = true
    axios
      .get('/auth', {
        headers: {
          "Authorization": token
        }
      })
      .then(response => {
        commit('changeProfile', {
          name: response.data.name,
          email: response.data.email,
          image: response.data.image,
          user_id: response.data.user_id
        })
        router.push({name: 'home'})
        state.loading = false
    })
  },
  signOut ({ dispatch, state }) {
    state.auth2.signOut().then(function () {
      dispatch('clearAuthData')
    })
  },
  clearAuthData ({ commit }) {
    commit('clearAuth')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('token')
    router.replace({name: 'login'})
  },
  tryAutoLogin ({ dispatch }) {
    const token =  localStorage.getItem('token')
    if (token) {
      const expirationDate = new Date(localStorage.getItem('expirationDate'))
      const now = new Date()
      if (now < expirationDate) {
        const remainingTime = expirationDate.getTime() - now.getTime()
        dispatch('setLogoutTimer', remainingTime)
        dispatch('gAuth', false)
      }
    }
  },
  setToken ({ commit }, payload) {
    commit('changeToken', payload)
  },
  createAuth2 ({ commit }, payload) {
    commit('auth2Object', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
