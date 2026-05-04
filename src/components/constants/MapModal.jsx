import React, { useEffect } from "react";
import L from "leaflet"; // Ensure L (Leaflet) is imported

const MapModal = ({ userLocation, setShowMap, setUserLocation }) => {
  useEffect(() => {
    if (userLocation) {
      const { latitude, longitude } = userLocation;

      // Initialize map only if userLocation exists
      const map = L.map("map").setView([latitude, longitude], 12);

      // Use OpenStreetMap's default tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map,
      );

      const marker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("You are here!");

      // Clean up the map on component unmount
      return () => {
        map.remove();
      };
    }
  }, [userLocation]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setShowMap(false)} // Close map when clicking outside of it
    >
      <div
        className="rounded bg-white p-4 shadow-lg"
        style={{ width: "80%", maxWidth: "600px", height: "80%" }}
        onClick={(e) => e.stopPropagation()} // Prevent map from closing when clicking inside the modal
      >
        {/* Map Container */}
        <div id="map" style={{ height: "100%" }} /> {/* Ensure height 100% */}
      </div>
    </div>
  );
};

export default MapModal;
