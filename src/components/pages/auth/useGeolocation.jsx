import { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";

export const useGeolocation = (location) => {
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const fetchCoordinatesFromLocation = async (location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}&addressdetails=1&limit=1`,
      );
      if (response.data && response.data[0]) {
        const { lat, lon, display_name, address } = response.data[0];
        setUserLocation({ latitude: lat, longitude: lon });
        setShowMap(true);
      }
    } catch (error) {
      console.error("Error fetching coordinates", error);
    }
  };

  const handleLocationSelect = (suggestion) => {
    setUserLocation({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    });
    setLocationSuggestions([]);
    setShowMap(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "location" && value) {
      fetchCoordinatesFromLocation(value);
    }
  };

  const getLocation = () => {
    if (location) {
      fetchCoordinatesFromLocation(location);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setShowMap(true);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (location) {
      fetchCoordinatesFromLocation(location);
    }
  }, [location]);

  return {
    userLocation,
    showMap,
    locationSuggestions,
    handleChange,
    handleLocationSelect,
    getLocation,
    setShowMap,
  };
};
