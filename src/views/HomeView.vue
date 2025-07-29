<template>
  <div class="home">
    <div class="welcome">
      <h1>Welcome to EAM Demo</h1>
      <p>Select an option from the menu to get started.</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 4rem);
}

.welcome {
  text-align: center;
  padding: 2rem;
  background-color: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

h1 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

p {
  color: var(--text-secondary-color);
  font-size: 1.1rem;
}
</style>
