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
            latitudeDelta: pickupLocation ? 0.10 : 0.0032,
            longitudeDelta: pickupLocation ? 0.10 : 0.0001,
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
          <TouchableOpacity style={style.vehicleButton}>
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/GoFleet Premium.png")}
            />
            <Text style={style.vehicleButtonText}>GoFleet Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.vehicleButton}>
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/Fleet Mini.png")}
            />
            <Text style={style.vehicleButtonText}>Fleet Mini</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.vehicleButton}>
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/Rickshaw.png")}
            />
            <Text style={style.vehicleButtonText}>Rikshaw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.vehicleButton}>
            <Image
              style={style.vehicleImage}
              source={require("../../assets/GoFleet Images/Bike.png")}
            />
            <Text style={style.vehicleButtonText}>Bike</Text>
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
                  {item.name} | {item.location.formatted_address}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {pickupLocation && (
          <View style={style.selectedLocationContainer}>
            <Text style={style.selectedLocationText}>
              Pickup Location: {pickupLocation.name}
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

        <TouchableOpacity style={style.findingRideButton}>
          <Text style={style.findingRideText}>Find Ride</Text>
        </TouchableOpacity>
      </View>
      {errorMsg && <Text>{errorMsg}</Text>}
    </View>
  );
}
