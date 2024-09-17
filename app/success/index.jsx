// Import necessary components from React Native and external libraries
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native"; // Core components for UI
import MapView, { Marker, Polyline } from "react-native-maps"; // Map component and Marker for pinning locations
import * as Location from "expo-location"; // Location services from Expo
import { useEffect, useState } from "react"; // React hooks for managing state and side effects
import style from "../../styles/home-css"; // Importing custom styles for this screen
import { addLocation, db } from "../../config/firestore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
// Main function that renders the HomeScreen component
export default function HomeScreen() {
  // State variables to track various pieces of data
  const [location, setLocation] = useState(null); // State to store user's current location

  const [pickupLocation, setPickupLocation] = useState(null); // State to store the selected pickup location
  const [dropOffLocation, setDropOffLocation] = useState(null); // State to store the selected drop-off location

  // Object that contains base fare rates for different vehicle types

  return (
    // Main container view for the HomeScreen component
    <View style={style.container}>
      {/* Render the MapView only if the location state is available */}
      {location && (
        <MapView
          style={style.map} // Apply styling to the MapView
          region={{
            // Set the region of the map based on the pickup location or current location
            latitude: pickupLocation
              ? pickupLocation.geocodes.main.latitude // Use pickup location latitude if available
              : location.coords.latitude, // Otherwise, use the current location latitude
            longitude: pickupLocation
              ? pickupLocation.geocodes.main.longitude // Use pickup location longitude if available
              : location.coords.longitude, // Otherwise, use the current location longitude
            latitudeDelta: pickupLocation ? 0.01 : 0.0032, // Adjust zoom level based on pickup location
            longitudeDelta: pickupLocation ? 0.05 : 0.0001, // Adjust zoom level based on pickup location
          }}
        >
          {/* Display the user's current location marker */}

          {/* Render the pickup location marker if available */}
          {pickupLocation && (
            <Marker
              coordinate={{
                latitude: pickupLocation.geocodes.main.latitude, // Latitude of the pickup location
                longitude: pickupLocation.geocodes.main.longitude, // Longitude of the pickup location
              }}
              title="Pickup Location" // Title for the pickup location marker
              pinColor="green"
            />
          )}

          {/* Render the drop-off location marker if available */}
          {dropOffLocation && (
            <Marker
              coordinate={{
                latitude: dropOffLocation.geocodes.main.latitude, // Latitude of the drop-off location
                longitude: dropOffLocation.geocodes.main.longitude, // Longitude of the drop-off location
              }}
              title="Drop-Off Location" // Title for the drop-off location marker
              description={dropOffLocation.location.formatted_address} // Description of the drop-off location
            />
          )}

          {/* Add a Polyline between the pickup and drop-off locations if both are available */}
          {pickupLocation && dropOffLocation && (
            <Polyline
              coordinates={[
                {
                  latitude: pickupLocation.geocodes.main.latitude,
                  longitude: pickupLocation.geocodes.main.longitude,
                },
                {
                  latitude: dropOffLocation.geocodes.main.latitude,
                  longitude: dropOffLocation.geocodes.main.longitude,
                },
              ]}
              strokeColor="#23B5D3" // Blue color for the polyline
              strokeWidth={4} // Width of the polyline
            />
          )}
        </MapView>
      )}

      {/* Container for input fields and vehicle selection buttons */}
      <View style={style.inputContainer}>
        {/* Display the fare */}
        <Text style={style.fareText}>Your Fare is PKR:</Text>
        {/* Button to find a ride */}
      </View>
    </View>
  );
}
