import { View, TextInput, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import style from "../../styles/home-css";

export default function HomeScreen() {
  // State to store the user's current location
  const [location, setLocation] = useState(null);

  // State to store any error message related to location permissions
  const [errorMsg, setErrorMsg] = useState(null);

  // State to store search results for the pickup location
  const [searchResult, setSearchResult] = useState(null);

  // State to store the selected pickup location
  const [pickupLocation, setPickupLocation] = useState(null);

  // useEffect to request location permissions and watch the user's location
  useEffect(() => {
    (async () => {
      // Request location permission from the user
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // If permission is denied, set an error message and exit the function
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Set options for location tracking
      const options = {
        accuracy: 5, // High accuracy for location data
        distanceInterval: 0.7, // Update location every 0.7 meters
      };

      // Watch the user's location and update the state with the new location data
      Location.watchPositionAsync(options, (location) => {
        setLocation(location);
      });
    })();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to find the pickup location based on user input
  function findingPickupLocation(picklocation) {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3gGfP49aMQlZ7kjUY/iVAkWpRdOiW6FJ3IoyTXRS2SP4=", // API key for Foursquare Places API
      },
    };

    // Fetch search results from Foursquare API based on the user's input and current location
    fetch(
      `https://api.foursquare.com/v3/places/search?query=${picklocation}&ll=${location.coords.latitude},${location.coords.longitude}&radius=2000`,
      options
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((response) => setSearchResult(response.results)) // Update search results state
      .catch((err) => console.error(err)); // Handle any errors that occur during the fetch
  }

  // Function to remove the selected pickup location
  function removePickup() {
    setPickupLocation(null); // Clear the selected pickup location
  }

  return (
    <View style={style.mapContainer}>
      {/* Display the map only if the location is available */}
      {location && (
        <MapView
          style={style.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0032,
            longitudeDelta: 0.0001,
          }}
        >
          {/* Marker to show the user's current location on the map */}
          <Marker coordinate={location.coords} />

          {/* Container for the input field and search results */}
          <View style={style.inputContainer}>
            {/* Input field for searching pickup locations */}
            <TextInput
              placeholder="Search Pickup location"
              onChangeText={findingPickupLocation}
              style={style.input}
            />

            {/* Display search results if available and no pickup location is selected */}
            {searchResult && !pickupLocation && (
              <View style={style.searchResultContainer}>
                {searchResult.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setPickupLocation(item)}
                  >
                    <Text style={style.searchResultText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Display selected pickup location with a remove button */}
            {pickupLocation && (
              <View style={style.selectedLocationContainer}>
                <Text style={style.selectedLocationText}>
                  Pickup Location Selected: {pickupLocation.name}
                </Text>
                <TouchableOpacity
                  onPress={removePickup}
                  style={style.removeButton}
                >
                  <Text style={style.removeButtonText}>Remove Pickup</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </MapView>
      )}

      {/* Display an error message if there is an issue with location permissions */}
      {errorMsg && <Text>{errorMsg}</Text>}
    </View>
  );
}
