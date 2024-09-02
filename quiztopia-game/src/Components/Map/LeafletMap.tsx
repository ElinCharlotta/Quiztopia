import React, { useState, useEffect } from 'react';
import leaflet, { Map, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.scss';

// Din ikon för markörer
const customIcon = new leaflet.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#449b92" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" stroke="#f5cc50" stroke-width="3" fill="#12182e"/>
      <circle cx="12" cy="12" r="5" fill="#ffbbf4"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MarkerData {
  lat: number;
  lng: number;
  question: string;
  answer: string;
}

interface LeafletMapProps {
  onMapClick: (lat: number, lng: number) => void;
  savedMarkers: MarkerData[];
}

function LeafletMap({ onMapClick}: LeafletMapProps) {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [userMarker, setUserMarker] = useState<Marker | null>(null);
  const [tempMarker, setTempMarker] = useState<Marker | null>(null);

  // Hämtar aktuell position
  useEffect(() => {
    if ('geolocation' in navigator && !position) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition(pos.coords);
      });
    }
  }, [position]);

  // Initierar kartan och markerar positionen
  useEffect(() => {
    if (position && !map) {
      const myMap = leaflet.map('map').setView([position.latitude, position.longitude], 15);

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(myMap);

   
      const marker = leaflet.marker([position.latitude, position.longitude], { icon: customIcon })
        .addTo(myMap)
        .bindPopup('HÄR ÄR JAG!');

      setUserMarker(marker);

      myMap.on('click', (event) => {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        onMapClick(lat, lng);

      
        const newTempMarker = leaflet.marker([lat, lng], { icon: customIcon }).addTo(myMap);
        setTempMarker(newTempMarker);
      });

      setMap(myMap);
    }
  }, [position, map, onMapClick, tempMarker]);



  return (
    <div id="map" style={{ height: '400px', width: '100%' }}></div>
  );
}

export default LeafletMap;
