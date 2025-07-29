<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import './assets/theme.css'

const router = useRouter()
const authStore = useAuthStore()
const theme = ref(localStorage.getItem('theme') || 'light')

const applyTheme = (themeValue) => {
  document.documentElement.setAttribute('data-theme', themeValue)
}

onMounted(() => {
  applyTheme(theme.value)
})

watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem('theme', newTheme)
})

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <nav v-if="authStore.isAuthenticated" class="nav-menu">
      <router-link to="/" class="nav-button" title="Home">
        Home
      </router-link>
      <router-link to="/insert" class="nav-button">
        Insert Data
      </router-link>
      <router-link to="/view" class="nav-button">
        View Data
      </router-link>
      <router-link to="/map" class="nav-button">
        Map View
      </router-link>
      <button @click="logout" class="nav-button logout">
        Logout
      </button>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <button class="theme-toggle" @click="toggleTheme" title="Toggle theme">
      {{ theme === 'dark' ? '🌞' : '🌙' }}
    </button>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.app {
  min-height: 100vh;
  display: flex;
  transition: all 0.3s ease;
}

.nav-menu {
  width: 240px;
  background-color: var(--surface-color);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.main-content {
  flex: 1;
  margin-left: 240px; /* Match nav-menu width */
  min-width: 100%;/* Ensure it takes remaining width */
}

.nav-button {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--text-color);
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-button:hover {
  background-color: var(--primary-color);
  color: white;
}

.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.logout {
  margin-top: auto;
  color: var(--error-color);
}

.logout:hover {
  background-color: var(--error-color);
  color: white;
}

.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: var(--surface-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 100;
}

.theme-toggle:hover {
  transform: scale(1.1);
}
</style>
