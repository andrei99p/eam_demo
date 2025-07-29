<template>
  <div class="insert-wizard">
    <div class="wizard-container">
      <div class="wizard-header">
        <h2>Step {{ currentStep }}/6: {{ stepLabels[currentStep - 1] }}</h2>
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${(currentStep / 6) * 100}%` }"></div>
        </div>
      </div>

      <div class="wizard-content">
        <div v-if="currentStep !== 6" class="form-group">
          <label :for="'step' + currentStep">{{ stepLabels[currentStep - 1] }}</label>
          <input
            :id="'step' + currentStep"
            v-model="formData[currentStep - 1]"
            type="text"
            :placeholder="'Enter ' + stepLabels[currentStep - 1].toLowerCase()"
          >
        </div>
        <div v-else class="location-fields">
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input
              id="latitude"
              v-model="locationData.latitude"
              type="number"
              step="0.000001"
              placeholder="Enter latitude (e.g., 44.4268)"
            >
          </div>
          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input
              id="longitude"
              v-model="locationData.longitude"
              type="number"
              step="0.000001"
              placeholder="Enter longitude (e.g., 26.1025)"
            >
          </div>
        </div>
      </div>

      <div class="wizard-footer">
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="btn-secondary"
        >
          Back
        </button>
        <button
          v-if="currentStep < 6"
          @click="nextStep"
          class="btn-primary"
          :disabled="!formData[currentStep - 1]"
        >
          Continue
        </button>
        <button
          v-else
          @click="saveData"
          class="btn-success"
          :disabled="!isStepValid"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(1)
const formData = ref(['', '', '', '', ''])
const locationData = ref({ latitude: '', longitude: '' })

const stepLabels = [
  'Categorie de informatii',
  'Capitole',
  'Subcapitole',
  'Diviziune',
  'Componenta',
  'Locatie'
]

const isStepValid = computed(() => {
  if (currentStep.value === 6) {
    return locationData.value.latitude && locationData.value.longitude
  }
  return formData.value[currentStep.value - 1]
})

const nextStep = () => {
  if (currentStep.value < 6) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const saveData = async () => {
  try {
    let existingData = []
    try {
      const response = await fetch(import.meta.env.BASE_URL + 'equipment_data.json')
      existingData = await response.json()
    } catch (error) {
      console.warn('No existing data found, creating new file')
    }

    const newEquipment = {
      categorie_informatii: formData.value[0],
      capitole: formData.value[1],
      subcapitole: formData.value[2],
      diviziune: formData.value[3],
      componenta: formData.value[4],
      latitude: parseFloat(locationData.value.latitude),
      longitude: parseFloat(locationData.value.longitude)
    }

    // Add new equipment to existing data
    existingData.push(newEquipment)

    // Save to server
    const saveResponse = await fetch('/api/save-equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(existingData)
    })

    if (!saveResponse.ok) {
      throw new Error('Failed to save data')
    }

    // Reset form and redirect
    formData.value = ['', '', '', '', '']
    locationData.value = { latitude: '', longitude: '' }
    currentStep.value = 1
    router.push('/view')
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Error saving data. Please try again.')
  }
}
</script>

<style scoped>
.insert-wizard {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  min-height: calc(100vh - 4rem);
}

.wizard-container {
  background-color: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.wizard-header {
  margin-bottom: 2rem;
}

h2 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
}

.progress {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--input-bg);
  color: var(--text-color);
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.wizard-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.2s;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover-color);
}

.btn-secondary {
  background-color: var(--surface-secondary-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--border-color);
}

.btn-success {
  background-color: var(--success-color);
  color: white;
}

.btn-success:hover:not(:disabled) {
  filter: brightness(1.1);
}

.location-fields {
  display: flex;
  gap: 1rem;
}

.location-fields .form-group {
  flex: 1;
}
</style>
