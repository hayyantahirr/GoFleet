import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    // borderColor: "red",
    // borderWidth: 2,
    boxsizing: "border-box",
  },
  map: {
    flex: 1,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    color: "black",
  },
  vehicleImage: {
    width: 50,
    height: 35,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 8,
  },
  vehicleButtonContainer: {
    flexDirection: "row",
    gap: 5,
    marginLeft: 0,
    marginRight: 10,
    marginBottom: 10,
  },
  vehicleButton: {
    width: "25%",
    height: 80,
    // borderColor: "black",
    // borderWidth: 1,
  },
  vehicleButtonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 10,
    color: "black",
  },
  searchResultContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },
  searchResultText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
    fontSize: 16,
  },
  selectedLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedLocationText: {
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
  },
  removeButtonText: {
    color: "red",
    fontWeight: "bold",
  },
  findingRideButton: {
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "red",

    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 15,
  },
  findingRideText: {
    textAlign: "center",
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  selectedVehicleButton: {
    backgroundColor: "blue", // Set the background color to blue for selected vehicle
    borderRadius: 15,
  },
});

export default style;
