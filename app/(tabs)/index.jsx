import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import style from "../../styles/home-css";

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [dropResult, setDropResult] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropOffLocation, setDropOffLocation] = useState(null);
  const [pickupInput, setPickupInput] = useState("");
  const [dropOffInput, setDropOffInput] = useState("");
  const [fare, setFare] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const rates = {
    FleetPremium: 120,
    FleetMini: 89.23,
    Rickshaw: 59.9956,
    Bike: 50,
  };
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const options = {
        accuracy: 4,
        distanceInterval: 1,
      };
      Location.watchPositionAsync(options, (location) => {
        setLocation(location);
      });
    })();
  }, []);

  function findingPickupLocation(picklocation) {
    setPickupInput(picklocation);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3gGfP49aMQlZ7kjUY/iVAkWpRdOiW6FJ3IoyTXRS2SP4=",
      },
    };

    fetch(
      `https://api.foursquare.com/v3/places/search?query=${picklocation}&ll=${location.coords.latitude},${location.coords.longitude}&radius=8000`,
      options
    )
      .then((response) => response.json())
      .then((response) => setSearchResult(response.results))
      .catch((err) => console.error(err));
  }

  function findingDropOffLocation(dropLocation) {
    setDropOffInput(dropLocation);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3gGfP49aMQlZ7kjUY/iVAkWpRdOiW6FJ3IoyTXRS2SP4=",
      },
    };

    fetch(
      `https://api.foursquare.com/v3/places/search?query=${dropLocation}&ll=${location.coords.latitude},${location.coords.longitude}&radius=8000`,
      options
    )
      .then((response) => response.json())
      .then((response) => setDropResult(response.results))
      .catch((err) => console.error(err));
  }

  function removePickup() {
    setPickupLocation(null);
    setPickupInput("");
  }

  function removeDropOff() {
    setDropOffLocation(null);
    setDropOffInput("");
  }
  function vehicles(vehicle) {
    console.log(rates[vehicle]);
    setSelectedVehicle(vehicle);
    const baseFare = rates[vehicle];
    console.log(
      "location.coords.latitude ==>>",
      location.coords.latitude,
      "location.coords.longitude ==>>",
      location.coords.longitude,
      "pickupLocation.location.lat==>>",
      dropOffLocation.geocodes.main.latitude,
      "pickupLocation.location.lng==>>",
      dropOffLocation.geocodes.main.longitude
    );

    const distance = calcCrow(
      pickupLocation.geocodes.main.latitude,
      pickupLocation.geocodes.main.longitude,
      dropOffLocation.geocodes.main.latitude,
      dropOffLocation.geocodes.main.longitude
    );
    const fareMade = baseFare * distance;
    setFare(Math.floor(fareMade));
    console.log(`your ${vehicle} fare is ${fare}`);
  }
  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }

  return (
    <View style={style.container}>
      {location && (
        <MapView
          style={style.map}
          region={{
            latitude: pickupLocation
              ? pickupLocation.geocodes.main.latitude
              : location.coords.latitude,
            longitude: pickupLocation
              ? pickupLocation.geocodes.main.longitude
              : location.coords.longitude,
            latitudeDelta: pickupLocation ? 0.1 : 0.0032,
            longitudeDelta: pickupLocation ? 0.1 : 0.0001,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />

          {/* Add a marker for the drop-off location if it is selected */}
          {dropOffLocation && (
            <Marker
              coordinate={{
                latitude: dropOffLocation.geocodes.main.latitude,
                longitude: dropOffLocation.geocodes.main.longitude,
              }}
              title="Drop-Off Location"
              description={dropOffLocation.location.formatted_address}
            />
          )}
        </MapView>
      )}

      <View style={style.inputContainer}>
        <View style={style.vehicleButtonContainer}>
          <TouchableOpacity
            style={[
              style.vehicleButton,
              selectedVehicle === "FleetPremium" && style.selectedVehicleButton, // Apply blue background if selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled style if either location is not selected
            ]}
            onPress={() => {
              vehicles("FleetPremium");
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button if locations are not selected
          >
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/FleetPremium.png")}
            />
            <Text
              style={[
                style.vehicleButtonText,
                selectedVehicle === "FleetPremium" &&
                  style.vehicleButtonTextSelected,
              ]}
            >
              Fleet Premium
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.vehicleButton,
              selectedVehicle === "FleetMini" && style.selectedVehicleButton, // Apply blue background if selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled style
            ]}
            onPress={() => {
              vehicles("FleetMini");
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button
          >
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/FleetMini.png")}
            />
            <Text
              style={[
                style.vehicleButtonText,
                selectedVehicle === "FleetMini" &&
                  style.vehicleButtonTextSelected,
              ]}
            >
              Fleet Mini
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.vehicleButton,
              selectedVehicle === "Rickshaw" && style.selectedVehicleButton, // Apply blue background if selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled style
            ]}
            onPress={() => {
              vehicles("Rickshaw");
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button
          >
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/Rickshaw.png")}
            />
            <Text
              style={[
                style.vehicleButtonText,
                selectedVehicle === "Rickshaw" &&
                  style.vehicleButtonTextSelected,
              ]}
            >
              Rickshaw
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.vehicleButton,
              selectedVehicle === "Bike" && style.selectedVehicleButton, // Apply blue background if selected
              (!pickupLocation || !dropOffLocation) && style.disabledButton, // Apply disabled style
            ]}
            onPress={() => {
              vehicles("Bike");
            }}
            disabled={!pickupLocation || !dropOffLocation} // Disable button
          >
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/Bike.png")}
            />
            <Text
              style={[
                style.vehicleButtonText,
                selectedVehicle === "Bike" && style.vehicleButtonTextSelected,
              ]}
            >
              Bike
            </Text>
          </TouchableOpacity>
        </View>

        {!pickupLocation && (
          <TextInput
            placeholder="Search Pickup location"
            onChangeText={findingPickupLocation}
            value={pickupInput}
            style={style.input}
          />
        )}
        {searchResult && !pickupLocation && (
          <View style={style.searchResultContainer}>
            {searchResult.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setPickupLocation(item);
                  setPickupInput("");
                }}
              >
                <Text style={style.searchResultText}>
                  {item.name} | {item.location.formatted_address}{" "}
                  {/* Join the words back into a string */}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {pickupLocation && (
          <View style={style.selectedLocationContainer}>
            <Text style={style.selectedLocationText}>
              Pickup Location:{" "}
              {pickupLocation.name
                .split(" ") // Split the address into words
                .slice(0, 2) // Limit the address to the first 8 words
                .join(" ")}
            </Text>
            <TouchableOpacity onPress={removePickup} style={style.removeButton}>
              <Text style={style.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {!dropOffLocation && (
          <TextInput
            placeholder="Search DropOff location"
            onChangeText={findingDropOffLocation}
            value={dropOffInput}
            style={style.input}
          />
        )}
        {dropResult && !dropOffLocation && (
          <View style={style.searchResultContainer}>
            {dropResult.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setDropOffLocation(item);
                  setDropOffInput("");
                }}
              >
                <Text style={style.searchResultText}>
                  {item.name} | {item.location.formatted_address}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {dropOffLocation && (
          <View style={style.selectedLocationContainer}>
            <Text style={style.selectedLocationText}>
              DropOff Location:{" "}
              {dropOffLocation.name
                .split(" ") // Split the address into words
                .slice(0, 2) // Limit the address to the first 8 words
                .join(" ")}
            </Text>
            <TouchableOpacity
              onPress={removeDropOff}
              style={style.removeButton}
            >
              <Text style={style.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={style.fareText}>Your Fare is PKR:{fare}</Text>
        <TouchableOpacity style={style.findingRideButton}>
          <Text style={style.findingRideText}>Find Ride</Text>
        </TouchableOpacity>
      </View>
      {errorMsg && <Text>{errorMsg}</Text>}
    </View>
  );
}
