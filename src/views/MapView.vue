<template>
  <div class="map-view">
    <div class="map-container">
      <div id="map" ref="mapContainer"></div>
      <div v-if="loading" class="loading">Loading map...</div>
      <div v-if="error" class="error">
        {{ error }}
      </div>
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
let userLocationWatcher = null
let userAccuracyCircle = ref(null)

const addMarker = (equipment) => {
  const marker = L.marker([equipment.lat, equipment.lng])
    .bindPopup(`
      <strong>${equipment.categorie_informatii}</strong><br>
      Capitole: ${equipment.capitole}<br>
      Subcapitole: ${equipment.subcapitole}<br>
      Diviziune: ${equipment.diviziune}<br>
      Componenta: ${equipment.componenta}
    `)
    .addTo(map)
  markers.push(marker)
}

const loadAndDisplayData = async () => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'equipment_data.json')
    const equipmentData = await response.json()

    if (equipmentData.length === 0) {
      error.value = 'No equipment data found'
      return
    }

    equipmentData.forEach(equipment => {
      if (equipment.latitude && equipment.longitude) {
        addMarker({
          lat: equipment.latitude,
          lng: equipment.longitude,
          ...equipment
        })
      }
    })

    // Fit map to show all markers
    if (markers.length > 0) {
      const bounds = window.L.latLngBounds(markers.map(m => m.getLatLng()))
      map.fitBounds(bounds, { padding: [50, 50] })
    } else {
      error.value = 'No valid coordinates found in the equipment data'
    }

  } catch (error) {
    console.error('Error loading data:', error)
    error.value = 'Error loading equipment location data'
  } finally {
    loading.value = false
  }
}

const initMap = () => {
  map = L.map(mapContainer.value).setView([44.4268, 26.1025], 13) // Default center on Bucharest

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Apply dark mode styles if needed
  if (document.querySelector('[data-theme="dark"]')) {
    mapContainer.value.style.filter = 'invert(90%) hue-rotate(180deg)'
  }
}

const addUserLocationMarker = (lat, lng, accuracy) => {
  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  })
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
    userAccuracyCircle.value.setRadius(accuracy * 0.1) // Reduce radius by 50%
  } else {
    userAccuracyCircle.value = L.circle([lat, lng], {
      radius: accuracy * 0.1, // Reduce radius by 50%
      color: '#007bff',
      fillColor: '#007bff',
      fillOpacity: 0.15,
      weight: 1
    }).addTo(map)
  }
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    userLocationWatcher = navigator.geolocation.watchPosition(
      (position) => {
        addUserLocationMarker(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        )
      },
      (err) => {
        console.warn('User location not available:', err)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
  }
}

const applyMapTheme = () => {
  if (!mapContainer.value) return
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    mapContainer.value.style.filter = 'invert(90%) hue-rotate(180deg)'
  } else {
    mapContainer.value.style.filter = ''
  }
}

onMounted(() => {
  initMap()
  loadAndDisplayData()
  getUserLocation()
  applyMapTheme()
})

watch(
  () => document.documentElement.getAttribute('data-theme'),
  () => {
    applyMapTheme()
  }
)
</script>

<style scoped>
.map-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
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
