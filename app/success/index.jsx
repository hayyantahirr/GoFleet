// Import necessary components from React Native and external libraries
import { View, Text } from "react-native"; // Core components for UI

import style from "../../styles/home-css"; // Importing custom styles for this screen
import MapView, { Marker, Polyline } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
// Main function that renders the HomeScreen component
export default function HomeScreen() {
  const params = useLocalSearchParams();
  const [location, setLocation] = useState(null); // State to store user's current location
  // State variables to track various pieces of data
  useEffect(() => {
    (async () => {
      // Request permission to access location in the foreground
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // If permission is not granted, set an error message and stop the function

        return;
      }
      // Options to set the accuracy and distance interval for location tracking
      const options = {
        accuracy: 4, // Accuracy level of location
        distanceInterval: 1, // Minimum distance (in meters) between location updates
      };
      // Watch the user's location and update the location state when the position changes
      Location.watchPositionAsync(options, (location) => {
        setLocation(location); // Set the current location to state
      });
    })();
    console.log("location added", location);
  }, []);
  // Object that contains base fare rates for different vehicle types

  return (
    // Main container view for the HomeScreen component
    <View style={style.container}>
      {location && (
        <MapView
          style={style.map} // Apply styling to the MapView
          region={{
            // Set the region of the map based on the pickup location or current location
            latitude: location.coords.latitude, // Otherwise, use the current location latitude
            longitude: location.coords.longitude, // Otherwise, use the current location longitude
            latitudeDelta: 0.1, // Adjust zoom level based on pickup location
            longitudeDelta: 0.05, // Adjust zoom level based on pickup location
          }}
        >
          <Marker
            coordinate={{
              latitude: params.pickupLocationLatitude,
              longitude: params.pickupLocationLongitude,
            }}
            title={params.pickupLocationName}
            pinColor="green"
          />
          <Marker
            coordinate={{
              latitude: params.dropoffLocationLatitude,
              longitude: params.dropoffLocationLongitude,
            }}
            title={params.dropoffLocationName}
            pinColor="red"
          />
          <Polyline
            strokeColor="#23B5D3" // Blue color for the polyline
            strokeWidth={4} // Width of the polyline
            coordinates={[
              {
                latitude: params.pickupLocationLatitude,
                longitude: params.pickupLocationLongitude,
              },
              {
                latitude: params.dropoffLocationLatitude,
                longitude: params.dropoffLocationLongitude,
              },
            ]}
          />
        </MapView>
      )}
      <View style={style.inputContainer}>
        {/* Display the fare */}
        <View style={style.selectedLocationContainer}>
          <Text style={style.selectedLocationText}>
            {params.pickupLocationName.split(" ").slice(0, 2).join(" ")}
            {/*Displaythe first two words of the pickup location name */}
          </Text>
        </View>
        <View style={style.selectedLocationContainer}>
          <Text style={style.selectedLocationText}>
            {params.dropoffLocationName}
          </Text>
        </View>
        <Text style={style.fareText}>Amount to Pay : {params.fare}</Text>
        <Text style={style.fareText}>
          Distance To Travel : {Math.round(params.distance)}
        </Text>
        <Text style={style.fareText}>Vehicle Selected :{params.vehicle}</Text>
        {/* Button to find a ride */}
      </View>
    </View>
  );
}
