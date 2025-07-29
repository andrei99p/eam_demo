import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    sessionTimeout: null
  }),

  actions: {
    login(username, password) {
      if (username === 'if' && password === 'parola') {
        this.isAuthenticated = true
        this.startSessionTimer()
        return true
      }
      return false
    },

    logout() {
      this.isAuthenticated = false
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout)
      }
    },

    startSessionTimer() {
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout)
      }
      // 10 minute timeout
      this.sessionTimeout = setTimeout(() => {
        this.logout()
      }, 10 * 60 * 1000)
    }
  }
})
