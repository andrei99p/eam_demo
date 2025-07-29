<template>
  <div class="view-data">
    <div class="content-container">
      <h2>View Equipment Data</h2>
      <div class="actions">
        <button @click="saveData" class="save-btn" :disabled="!hasChanges">Save to JSON</button>
        <button @click="exportToExcel" class="export-btn" :disabled="!equipmentData.length">Export to Excel</button>
      </div>
      <div class="table-container">
        <table v-if="equipmentData.length">
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">{{ header }}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in equipmentData" :key="index">
              <td>
                <input v-model="item.categorie_informatii" type="text" class="cell-input">
              </td>
              <td>
                <input v-model="item.capitole" type="text" class="cell-input">
              </td>
              <td>
                <input v-model="item.subcapitole" type="text" class="cell-input">
              </td>
              <td>
                <input v-model="item.diviziune" type="text" class="cell-input">
              </td>
              <td>
                <input v-model="item.componenta" type="text" class="cell-input">
              </td>
              <td class="location-cell">
                <div class="location-inputs">
                  <input v-model="item.latitude" type="number" step="0.000001" class="cell-input" placeholder="Latitude">
                  <input v-model="item.longitude" type="number" step="0.000001" class="cell-input" placeholder="Longitude">
                </div>
              </td>
              <td>
                <button @click="deleteRow(item, index)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!equipmentData.length" class="no-data">
          No data available. Please use Insert Data page to add equipment.
        </div>
      </div>
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'

const headers = [
  'Categorie de informatii',
  'Capitole',
  'Subcapitole',
  'Diviziune',
  'Componenta',
  'Locatie'
]
const equipmentData = ref([])
const hasChanges = ref(false)
const message = ref('')
const messageType = ref('')

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const loadData = async () => {
  try {
    const response = await fetch('./equipment_data.json')
    const jsonData = await response.json()
    equipmentData.value = jsonData
    hasChanges.value = false
  } catch (error) {
    console.error('Error loading data:', error)
    equipmentData.value = []
    showMessage('Error loading data', 'error')
  }
}

const saveData = async () => {
  try {
    const response = await fetch('/api/save-equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipmentData.value)
    })

    if (!response.ok) throw new Error('Failed to save data')

    hasChanges.value = false
    showMessage('Data saved successfully')
  } catch (error) {
    console.error('Error saving data:', error)
    showMessage('Error saving data', 'error')
  }
}

const exportToExcel = () => {
  try {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(equipmentData.value.map(item => ({
      'Categorie de informatii': item.categorie_informatii,
      'Capitole': item.capitole,
      'Subcapitole': item.subcapitole,
      'Diviziune': item.diviziune,
      'Componenta': item.componenta,
      'Locatie': `${item.latitude}, ${item.longitude}`
    })))

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipment')
    XLSX.writeFile(workbook, 'equipment_data.xlsx')
    showMessage('Excel file exported successfully')
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    showMessage('Error exporting to Excel', 'error')
  }
}

const deleteRow = (item) => {
  const index = equipmentData.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    equipmentData.value.splice(index, 1)
    hasChanges.value = true
  }
}

watch(equipmentData, () => {
  hasChanges.value = true
}, { deep: true })

onMounted(() => {
  loadData()
})
</script>

<style scoped>
:root {
  --table-bg: #fff;
  --table-header-bg: #f2f2f2;
  --table-row-alt-bg: #f9f9f9;
  --table-border: #ddd;
  --table-text: #222;
  --input-bg: #fff;
  --input-border: #ddd;
  --input-text: #222;
}
[data-theme="dark"] :root, :host([data-theme="dark"]) {
  --table-bg: #23272f;
  --table-header-bg: #2d323c;
  --table-row-alt-bg: #262b34;
  --table-border: #444a57;
  --table-text: #e0e0e0;
  --input-bg: #23272f;
  --input-border: #444a57;
  --input-text: #e0e0e0;
}

.view-data {
  padding: 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.actions {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.save-btn, .export-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background-color: #2196F3;
  color: white;
}

.save-btn:disabled {
  background-color: #90CAF9;
  cursor: not-allowed;
}

.export-btn {
  background-color: #4CAF50;
  color: white;
}

.export-btn:disabled {
  background-color: #A5D6A7;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: var(--table-bg);
  color: var(--table-text);
}

th, td {
  border: 1px solid var(--table-border);
  padding: 8px;
  text-align: left;
}

th {
  background-color: var(--table-header-bg);
}

tr:nth-child(even) {
  background-color: var(--table-row-alt-bg);
}

.cell-input {
  width: 100%;
  padding: 4px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--input-text);
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

.message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.message.success {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.message.error {
  background-color: #FFEBEE;
  color: #C62828;
}

.location-cell {
  min-width: 200px;
}

.location-inputs {
  display: flex;
  gap: 0.5rem;
}

.location-inputs .cell-input {
  width: calc(50% - 0.25rem);
}
</style>
