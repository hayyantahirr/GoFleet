import { View } from "react-native";
import style from "../../styles/home-css";
import MapView from "react-native-maps";
export default function HomeScreen() {
  return (
    <>
      <View style={style.mapContainer}>
        <MapView style={style.map} />
      </View>
    </>
  );
}
