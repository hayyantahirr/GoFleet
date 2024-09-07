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
    width: "100%",
  },
  input: {
    marginTop: 40,

    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
  },
  searchResultContainer: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    // padding: 10,
  },
  searchResultText: {
    // paddingVertical: 5,
    borderColor: "black",
    borderWidth: 1,
    fontSize: 16,
  },
  address : {
    fontSize: 10,
    opacity: 0.5
  },
  selectedLocationContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    height: 40,
    // textAlign: "center",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  selectedLocationText: {
    fontSize: 16,
    // textAlign: "center",
    marginLeft: "auto",
  },
  removeButton: {
   marginRight:"auto",
   marginLeft:"auto",
    
    
    
  },
  removeButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default style;
