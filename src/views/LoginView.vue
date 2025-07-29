<template>
  <div class="login-container">
    <div class="login-box">
      <h1>EAM Demo Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            autocomplete="username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            autocomplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
        <p v-if="error" class="error">Invalid credentials</p>
        <p class="hint">Use username: if / password: parola</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref(false)

const handleLogin = () => {
  if (authStore.login(username.value, password.value)) {
    error.value = false
    router.push('/')
  } else {
    error.value = true
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 1rem;
}

.login-box {
  background-color: var(--surface-color);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--input-bg);
  color: var(--text-color);
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--primary-hover-color);
}

.error {
  color: var(--error-color);
  margin-top: 1rem;
  text-align: center;
}

.hint {
  margin-top: 1rem;
  text-align: center;
  color: var(--text-secondary-color);
  font-size: 0.9rem;
}
</style>
