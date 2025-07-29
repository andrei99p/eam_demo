<template>
  <div class="map-view">
    <div class="map-container">
      <div id="map" ref="mapContainer"></div>
      <div v-if="loading" class="loading">Loading map...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const mapContainer = ref(null)
const loading = ref(true)
const error = ref('')
let map = null
let markers = []
const userMarker = ref(null)
let userAccuracyCircle = ref(null)

const equipmentIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
})

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
})

const addEquipmentMarker = (equipment) => {
  if (typeof equipment.latitude === 'number' && typeof equipment.longitude === 'number') {
    const marker = L.marker([equipment.latitude, equipment.longitude], { icon: equipmentIcon })
      .bindPopup(`
        <strong>${equipment.categorie_informatii || ''}</strong><br>
        Capitole: ${equipment.capitole || ''}<br>
        Subcapitole: ${equipment.subcapitole || ''}<br>
        Diviziune: ${equipment.diviziune || ''}<br>
        Componenta: ${equipment.componenta || ''}
      `)
      .addTo(map)
    markers.push(marker)
  }
}

const addUserLocationMarker = (lat, lng, accuracy) => {
  if (userMarker.value) {
    userMarker.value.setLatLng([lat, lng])
  } else {
    userMarker.value = L.marker([lat, lng], { icon: userIcon })
      .bindPopup('You are here')
      .addTo(map)
  }
  // Draw/update accuracy circle
  if (userAccuracyCircle.value) {
    userAccuracyCircle.value.setLatLng([lat, lng])
    userAccuracyCircle.value.setRadius(accuracy * 0.1)
  } else {
    userAccuracyCircle.value = L.circle([lat, lng], {
      radius: accuracy * 0.1,
      color: '#007bff',
      fillColor: '#007bff',
      fillOpacity: 0.15,
      weight: 1
    }).addTo(map)
  }
}

const loadAndDisplayData = async () => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'equipment_data.json')
    const equipmentData = await response.json()
    if (!Array.isArray(equipmentData) || equipmentData.length === 0) {
      error.value = 'No equipment data found'
      return
    }
    markers.forEach(m => m.remove())
    markers = []
    equipmentData.forEach(equipment => {
      addEquipmentMarker(equipment)
    })
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.getLatLng()))
      map.fitBounds(bounds, { padding: [50, 50] })
    } else {
      map.setView([44.4268, 26.1025], 13)
    }
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = 'Error loading equipment location data'
  } finally {
    loading.value = false
  }
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        addUserLocationMarker(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        )
        // Optionally, zoom to user location
        map.setView([position.coords.latitude, position.coords.longitude], 15)
      },
      (err) => {
        console.warn('User location not available:', err)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
  }
}

const initMap = () => {
  map = L.map(mapContainer.value).setView([44.4268, 26.1025], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
}

onMounted(() => {
  initMap()
  loadAndDisplayData()
  getUserLocation()
})
</script>

<style scoped>
.map-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  height: 100vh;
}

.map-container {
  position: relative;
  height: 100%;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 4px;
  z-index: 1000;
}

.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.1);
  color: red;
  padding: 1rem;
  border-radius: 4px;
  z-index: 1000;
}
</style>
