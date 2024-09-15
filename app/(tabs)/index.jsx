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
  const [errorMsg, setErrorMsg] = useState(null); // State to store any error message related to location access
  const [searchResult, setSearchResult] = useState(null); // State to store results from the pickup location search
  const [dropResult, setDropResult] = useState(null); // State to store results from the drop-off location search
  const [pickupLocation, setPickupLocation] = useState(null); // State to store the selected pickup location
  const [dropOffLocation, setDropOffLocation] = useState(null); // State to store the selected drop-off location
  const [pickupInput, setPickupInput] = useState(""); // State to store the current input in the pickup location search
  const [dropOffInput, setDropOffInput] = useState(""); // State to store the current input in the drop-off location search
  const [fare, setFare] = useState(0); // State to store the calculated fare based on the distance
  const [selectedVehicle, setSelectedVehicle] = useState(null); // State to store the selected vehicle type
  const [acceptedRides, setAcceptedRides] = useState([]); // State to store the list of accepted rides
  // Object that contains base fare rates for different vehicle types
  const rates = {
    FleetPremium: 120, // Base fare for Fleet Premium
    FleetMini: 89.23, // Base fare for Fleet Mini
    Rickshaw: 59.9956, // Base fare for Rickshaw
    Bike: 50, // Base fare for Bike
  };

  // useEffect hook to request location permissions and watch the user's position
  useEffect(() => {
    locationPermit();
    realTimeRide();
  }, []); // Empty array ensures this runs only once when the component mounts
  function locationPermit() {
    (async () => {
      // Request permission to access location in the foreground
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // If permission is not granted, set an error message and stop the function
        setErrorMsg("Permission to access location was denied");
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
  }
  // Function to search for pickup locations using Foursquare API
  function findingPickupLocation(picklocation) {
    setPickupInput(picklocation); // Update the input state with the current pickup search query

    // Request options for the Foursquare Places API
    const options = {
      method: "GET", // HTTP GET request
      headers: {
        accept: "application/json", // Accepting a JSON response
        Authorization: "fsq3gGfP49aMQlZ7kjUY/iVAkWpRdOiW6FJ3IoyTXRS2SP4=", // API key for Foursquare
      },
    };

    // Fetch the results from Foursquare based on the user's query and current location
    fetch(
      `https://api.foursquare.com/v3/places/search?query=${picklocation}&ll=${location.coords.latitude},${location.coords.longitude}&radius=8000`,
      options
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((response) => setSearchResult(response.results)) // Store the search results in the state
      .catch((err) => console.error(err)); // Log any errors that occur
  }

  // Function to search for drop-off locations using Foursquare API
  function findingDropOffLocation(dropLocation) {
    setDropOffInput(dropLocation); // Update the input state with the current drop-off search query

    // Request options for the Foursquare Places API
    const options = {
      method: "GET", // HTTP GET request
      headers: {
        accept: "application/json", // Accepting a JSON response
        Authorization: "fsq3gGfP49aMQlZ7kjUY/iVAkWpRdOiW6FJ3IoyTXRS2SP4=", // API key for Foursquare
      },
    };

    // Fetch the results from Foursquare based on the user's query and current location
    fetch(
      `https://api.foursquare.com/v3/places/search?query=${dropLocation}&ll=${location.coords.latitude},${location.coords.longitude}&radius=8000`,
      options
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((response) => setDropResult(response.results)) // Store the search results in the state
      .catch((err) => console.error(err)); // Log any errors that occur
  }

  // Function to remove the selected pickup location and clear the input field
  function removePickup() {
    setPickupLocation(null); // Clear the selected pickup location
    setPickupInput(""); // Clear the input field for pickup location
  }

  // Function to remove the selected drop-off location and clear the input field
  function removeDropOff() {
    setDropOffLocation(null); // Clear the selected drop-off location
    setDropOffInput(""); // Clear the input field for drop-off location
  }

  // Function to handle vehicle selection and calculate fare
  function vehicles(vehicle) {
    console.log(rates[vehicle]); // Log the base fare for the selected vehicle
    setSelectedVehicle(vehicle); // Set the selected vehicle in state
    const baseFare = rates[vehicle]; // Get the base fare for the selected vehicle

    // Log the current location and selected pickup and drop-off locations
    console.log(
      "location.coords.latitude ==>>",
      location,
      "location.coords.longitude ==>>",
      location.coords.longitude,
      "pickupLocation.location.lat==>>",
      dropOffLocation.geocodes.main.latitude,
      "pickupLocation.location.lng==>>",
      dropOffLocation.geocodes.main.longitude
    );

    // Calculate the distance between the pickup and drop-off locations
    const distance = calcCrow(
      pickupLocation.geocodes.main.latitude,
      pickupLocation.geocodes.main.longitude,
      dropOffLocation.geocodes.main.latitude,
      dropOffLocation.geocodes.main.longitude
    );
    // Calculate the fare based on the distance and base fare
    const fareMade = baseFare * distance;
    setFare(Math.floor(fareMade)); // Round down the fare and set it in state
    console.log(`your ${vehicle} fare is ${fare}`); // Log the calculated fare
  }

  // Function to calculate the distance between two coordinates using the Haversine formula
  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the Earth in kilometers
    var dLat = toRad(lat2 - lat1); // Difference in latitude converted to radians
    var dLon = toRad(lon2 - lon1); // Difference in longitude converted to radians
    var lat1 = toRad(lat1); // Convert latitude of point 1 to radians
    var lat2 = toRad(lat2); // Convert latitude of point 2 to radians

    // Haversine formula to calculate the distance between two points on a sphere
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Calculate the angular distance
    var d = R * c; // Distance in kilometers
    return d; // Return the calculated distance
  }

  // Function to convert degrees to radians (used in distance calculation)
  function toRad(Value) {
    return (Value * Math.PI) / 180; // Convert degrees to radians
  }

  function addLoc() {
    // pickuplatitude & logitude , dropofflatitude & dropofflongitude,fare,status.vehicle,distance
    addLocation({
      Pickuplatitude: pickupLocation.geocodes.main.latitude,
      Pickuplongitude: pickupLocation.geocodes.main.longitude,
      Dropofflatitude: dropOffLocation.geocodes.main.latitude,
      dropofflongitude: dropOffLocation.geocodes.main.longitude,
      pickupLocationName: pickupLocation.name,
      dropoffLocationName: dropOffLocation.name,
      fare: fare,
      vehicle: selectedVehicle,
      distance: calcCrow(
        pickupLocation.geocodes.main.latitude,
        pickupLocation.geocodes.main.longitude,
        dropOffLocation.geocodes.main.latitude,
        dropOffLocation.geocodes.main.longitude
      ),
      status: "Pending",
    });
    if (acceptedRides[0] === "Accepted") {
      return [style.button, style.acceptedButton]; // Green color for accepted rides
    } else if (acceptedRides[0] === "Pending") {
      return [style.button, style.pendingButton]; // Gray color for pending rides
    } else if (acceptedRides[0] === "Rejected") {
      return [style.button, style.rejectedButton]; // Red color for rejected rides
    }
    return style.findingRideButton; // Default button style if no status is available
    // console.log(pickupLocation);
    // console.log(dropOffLocation);
  }
  function realTimeRide() {
    const q = query(collection(db, "RidesInfo"));
    onSnapshot(q, (querySnapshot) => {
      const acceptRides = [];
      querySnapshot.forEach((doc) => {
        acceptRides.push(doc.data().status);
      });
      console.log("status of ride ", acceptRides);
      setAcceptedRides([...acceptRides]);
    });
  }
  const getButtonStyle = () => {
    if (acceptedRides[0] === "accepted") {
      return [style.button, style.acceptedButton]; // Green color for accepted rides
    } else if (acceptedRides[0] === "Pending") {
      return [style.button, style.pendingButton]; // Gray color for pending rides
    } else if (acceptedRides[0] === "rejected") {
      return [style.button, style.rejectedButton]; // Red color for rejected rides
    }
    return style.findingRideButton; // Default button style if no status is available
  };

  const getButtonText = () => {
    if (acceptedRides[0] === "accepted") {
      return "Ride Accepted";
    } else if (acceptedRides[0] === "Pending") {
      return "Processing...";
    } else if (acceptedRides[0] === "rejected") {
      return "Cancelled";
    }
    return "Find Ride"; // Default text if no status is available
  };
  function handleFindRideClick() {
    setButtonDisabled(true); // Disable the button once it's clicked
  }
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
        {/* Container for vehicle selection buttons */}
        <Image
          source={require("../../assets/GoFleet Images/Go_fleet-removebg-preview.png")} // Path to the logo image
          style={style.Logo} // Apply styling to the logo
        />
        <View style={style.vehicleButtonContainer}>
          {/* Button for Fleet Premium vehicle */}
          <TouchableOpacity
            style={[
              style.vehicleButton, // Default button styling
              selectedVehicle === "FleetPremium" && style.selectedVehicleButton, // Apply selected styling if Fleet Premium is selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled styling if either location is not selected
            ]}
            onPress={() => {
              vehicles("FleetPremium"); // Call vehicles function with Fleet Premium as argument
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button if locations are not selected
          >
            <Image
              style={style.vehicleImage} // Apply styling to vehicle image
              source={require("../../assets/GoFleet Images/FleetPremium.png")} // Path to the Fleet Premium image
            />
            <Text
              style={[
                style.vehicleButtonText, // Default button text styling
                selectedVehicle === "FleetPremium" &&
                  style.vehicleButtonTextSelected, // Apply selected text styling if Fleet Premium is selected
              ]}
            >
              Fleet Premium
            </Text>
          </TouchableOpacity>

          {/* Button for Fleet Mini vehicle */}
          <TouchableOpacity
            style={[
              style.vehicleButton, // Default button styling
              selectedVehicle === "FleetMini" && style.selectedVehicleButton, // Apply selected styling if Fleet Mini is selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled styling if either location is not selected
            ]}
            onPress={() => {
              vehicles("FleetMini"); // Call vehicles function with Fleet Mini as argument
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button if locations are not selected
          >
            <Image
              style={style.vehicleImage} // Apply styling to vehicle image
              source={require("../../assets/GoFleet Images/FleetMini.png")} // Path to the Fleet Mini image
            />
            <Text
              style={[
                style.vehicleButtonText, // Default button text styling
                selectedVehicle === "FleetMini" &&
                  style.vehicleButtonTextSelected, // Apply selected text styling if Fleet Mini is selected
              ]}
            >
              Fleet Mini
            </Text>
          </TouchableOpacity>

          {/* Button for Rickshaw vehicle */}
          <TouchableOpacity
            style={[
              style.vehicleButton, // Default button styling
              selectedVehicle === "Rickshaw" && style.selectedVehicleButton, // Apply selected styling if Rickshaw is selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled styling if either location is not selected
            ]}
            onPress={() => {
              vehicles("Rickshaw"); // Call vehicles function with Rickshaw as argument
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button if locations are not selected
          >
            <Image
              style={style.vehicleImage} // Apply styling to vehicle image
              source={require("../../assets/GoFleet Images/Rickshaw.png")} // Path to the Rickshaw image
            />
            <Text
              style={[
                style.vehicleButtonText, // Default button text styling
                selectedVehicle === "Rickshaw" &&
                  style.vehicleButtonTextSelected, // Apply selected text styling if Rickshaw is selected
              ]}
            >
              Rickshaw
            </Text>
          </TouchableOpacity>

          {/* Button for Bike vehicle */}
          <TouchableOpacity
            style={[
              style.vehicleButton, // Default button styling
              selectedVehicle === "Bike" && style.selectedVehicleButton, // Apply selected styling if Bike is selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled styling if either location is not selected
            ]}
            onPress={() => {
              vehicles("Bike"); // Call vehicles function with Bike as argument
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button if locations are not selected
          >
            <Image
              style={style.vehicleImage} // Apply styling to vehicle image
              source={require("../../assets/GoFleet Images/Bike.png")} // Path to the Bike image
            />
            <Text
              style={[
                style.vehicleButtonText, // Default button text styling
                selectedVehicle === "Bike" && style.vehicleButtonTextSelected, // Apply selected text styling if Bike is selected
              ]}
            >
              Bike
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render pickup location input field if no pickup location is selected */}
        {!pickupLocation && (
          <TextInput
            placeholder="Search Pickup location" // Placeholder text for the input field
            onChangeText={findingPickupLocation} // Function to call when text changes
            value={pickupInput} // Value of the input field
            style={style.input} // Apply styling to the input field
          />
        )}
        {/* Render search results for pickup location if available and no pickup location is selected */}
        {searchResult && !pickupLocation && (
          <View style={style.searchResultContainer}>
            {searchResult.map((item, index) => (
              <TouchableOpacity
                key={index} // Unique key for each item
                onPress={() => {
                  setPickupLocation(item); // Set the selected pickup location
                  setPickupInput(""); // Clear the input field
                }}
              >
                <Text style={style.searchResultText}>
                  {item.name} | {item.location.formatted_address}{" "}
                  {/*Display name and address of the search result */}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Render selected pickup location details if a pickup location is selected */}
        {pickupLocation && (
          <View style={style.selectedLocationContainer}>
            <Text style={style.selectedLocationText}>
              Pickup Location:{" "}
              {pickupLocation.name.split(" ").slice(0, 2).join(" ")}
              {/*Displaythe first two words of the pickup location name */}
            </Text>
            <TouchableOpacity onPress={removePickup} style={style.removeButton}>
              <Text style={style.removeButtonText}>Remove</Text>
              {/* Button toremove the pickup location */}
            </TouchableOpacity>
          </View>
        )}

        {/* Render drop-off location input field if no drop-off location is selected */}
        {!dropOffLocation && (
          <TextInput
            placeholder="Search DropOff location" // Placeholder text for the input field
            onChangeText={findingDropOffLocation} // Function to call when text changes
            value={dropOffInput} // Value of the input field
            style={style.input} // Apply styling to the input field
          />
        )}
        {/* Render search results for drop-off location if available and no drop-off location is selected */}
        {dropResult && !dropOffLocation && (
          <View style={style.searchResultContainer}>
            {dropResult.map((item, index) => (
              <TouchableOpacity
                key={index} // Unique key for each item
                onPress={() => {
                  setDropOffLocation(item); // Set the selected drop-off location
                  setDropOffInput(""); // Clear the input field
                }}
              >
                <Text style={style.searchResultText}>
                  {item.name} | {item.location.formatted_address}
                  {/* // Display name and address of the search result */}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Render selected drop-off location details if a drop-off location is selected */}
        {dropOffLocation && (
          <View style={style.selectedLocationContainer}>
            <Text style={style.selectedLocationText}>
              DropOff Location:
              {dropOffLocation.name.split(" ").slice(0, 2).join(" ")}
              {/*  Display the first two words of the drop-off location name */}
            </Text>
            <TouchableOpacity
              onPress={removeDropOff} // Function to call when the remove button is pressed
              style={style.removeButton} // Apply styling to the remove button
            >
              <Text style={style.removeButtonText}>Remove</Text>
              {/* // Button to remove the drop-off location */}
            </TouchableOpacity>
          </View>
        )}

        {/* Display the fare */}
        <Text style={style.fareText}>Your Fare is PKR:{fare}</Text>
        {/* Button to find a ride */}
        <TouchableOpacity style={getButtonStyle()} onPress={addLoc}>
          <Text style={style.findingRideText}>{getButtonText()}</Text>
          {/* // Text on the button */}
        </TouchableOpacity>
      </View>

      {/* Display error message if available */}
      {errorMsg && <Text>{errorMsg}</Text>}
    </View>
  );
}
// ### Brief Explanation of Conditions:

// 1. **`location`**: The map is displayed only if `location` data is available.
// 2. **`pickupLocation`**: If `pickupLocation` is set, the map region and markers are adjusted based on the pickup and drop-off locations.
// 3. **`dropOffLocation`**: The drop-off marker is displayed only if `dropOffLocation` is available.
// 4. **Vehicle Buttons**: Each vehicle button is styled based on whether it is selected (`selectedVehicle`) and whether pickup and drop-off locations are selected.
// 5. **Pickup Location Input Field**: Displayed if `pickupLocation` is not set. It also shows search results if available.
// 6. **Drop-Off Location Input Field**: Displayed if `dropOffLocation` is not set. It also shows search results if available.
// 7. **Selected Pickup/Drop-Off Location**: Details are shown if `pickupLocation` or `dropOffLocation` are set.
// 8. **Fare and Find Ride Button**: Always displayed, regardless of the location selection state.
// 9. **Error Message**: Shown if `errorMsg` is set.
