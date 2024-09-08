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

  // State to store search results for the drop-off location
  const [dropResult, setDropResult] = useState(null);

  // State to store the selected pickup location
  const [pickupLocation, setPickupLocation] = useState(null);

  // State to store the selected drop-off location
  const [dropOffLocation, setDropOffLocation] = useState(null);

  // State to store the value of the pickup input field
  const [pickupInput, setPickupInput] = useState("");

  // State to store the value of the drop-off input field
  const [dropOffInput, setDropOffInput] = useState("");

  // useEffect to request location permissions and watch the user's location
  useEffect(() => {
    (async () => {
      // Request location permission from the user
      let { status } = await Location.requestForegroundPermissionsAsync();

      // If permission is denied, set an error message and exit the function
      if (status !== "granted") {
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
        setLocation(location); // Update the location state with the new location
      });
    })();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to find the pickup location based on user input
  function findingPickupLocation(picklocation) {
    setPickupInput(picklocation); // Update the input field value
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3gGfP49aMQlZ7kjUY/iVAkWpRdOiW6FJ3IoyTXRS2SP4=", // API key for Foursquare Places API
      },
    };

    // Fetch search results from Foursquare API based on the user's input and current location
    fetch(
      `https://api.foursquare.com/v3/places/search?query=${picklocation}&ll=${location.coords.latitude},${location.coords.longitude}&radius=8000`,
      options
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((response) => setSearchResult(response.results)) // Update search results state with the fetched data
      .catch((err) => console.error(err)); // Handle any errors that occur during the fetch
  }

  // Function to find the drop-off location based on user input
  function findingDropOffLocation(dropLocation) {
    setDropOffInput(dropLocation); // Update the input field value
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3gGfP49aMQlZ7kjUY/iVAkWpRdOiW6FJ3IoyTXRS2SP4=", // API key for Foursquare Places API
      },
    };

    // Fetch search results from Foursquare API based on the user's input and current location
    fetch(
      `https://api.foursquare.com/v3/places/search?query=${dropLocation}&ll=${location.coords.latitude},${location.coords.longitude}&radius=8000`,
      options
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((response) => setDropResult(response.results)) // Update drop-off search results state with the fetched data
      .catch((err) => console.error(err)); // Handle any errors that occur during the fetch
  }

  // Function to remove the selected pickup location
  function removePickup() {
    setPickupLocation(null); // Clear the selected pickup location
    setPickupInput(""); // Clear the input field value
  }

  // Function to remove the selected drop-off location
  function removeDropOff() {
    setDropOffLocation(null); // Clear the selected drop-off location
    setDropOffInput(""); // Clear the input field value
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

          {/* Container for the input fields and search results */}
          <View style={style.inputContainer}>
            {/* Input field for searching pickup locations */}
            <TextInput
              placeholder="Search Pickup location"
              onChangeText={findingPickupLocation}
              value={pickupInput}
              style={style.input}
              editable={!pickupLocation} // Disable input if pickup location is selected
            />
            {/* Display search results if available and no pickup location is selected */}
            {searchResult && !pickupLocation && (
              <View style={style.searchResultContainer}>
                {searchResult.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setPickupLocation(item);
                      setPickupInput(""); // Clear the input field after selecting a location
                    }}
                  >
                    <Text style={style.searchResultText}>
                      {item.name} | {item.location.formatted_address}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* Display selected pickup location with a remove button */}
            {pickupLocation && (
              <View style={style.selectedLocationContainer}>
                <Text style={style.selectedLocationText}>
                  Pickup Location: {pickupLocation.name}
                </Text>
                <TouchableOpacity
                  onPress={removePickup}
                  style={style.removeButton}
                >
                  <Text style={style.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Input field for searching drop-off locations */}
            <TextInput
              placeholder="Search DropOff location"
              onChangeText={findingDropOffLocation}
              value={dropOffInput}
              style={style.input}
              editable={!dropOffLocation} // Disable input if drop-off location is selected
            />
            {/* Display search results if available and no drop-off location is selected */}
            {dropResult && !dropOffLocation && (
              <View style={style.searchResultContainer}>
                {dropResult.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setDropOffLocation(item);
                      setDropOffInput(""); // Clear the input field after selecting a location
                    }}
                  >
                    <Text style={style.searchResultText}>
                      {item.name} | {item.location.formatted_address}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* Display selected drop-off location with a remove button */}
            {dropOffLocation && (
              <View style={style.selectedLocationContainer}>
                <Text style={style.selectedLocationText}>
                  DropOff Location: {dropOffLocation.name}
                </Text>
                <TouchableOpacity
                  onPress={removeDropOff}
                  style={style.removeButton}
                >
                  <Text style={style.removeButtonText}>Remove</Text>
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
