import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    width: "90%",
    marginTop: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  searchResultContainer: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  searchResultText: {
    paddingVertical: 5,
    fontSize: 16,
  },
  selectedLocationContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedLocationText: {
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default style;
