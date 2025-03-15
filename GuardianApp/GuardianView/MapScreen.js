import React from "react";
import { StyleSheet, View, Image, Text, Platform, StatusBar, SafeAreaView } from "react-native";
import MapView, { Marker } from "@teovilla/react-native-web-maps";
import { MaterialIcons } from "react-native-vector-icons";
import { ScrollView } from "react-native-web";

const MapScreen = () => {
  const [destinations, setDestinations] = React.useState([
    { id: "0", localisation: "Leżajsk - Now" },
    { id: "0", localisation: "Tryńcza - 3 hours ago" },
    { id: "0", localisation: "Kraków - 5 hours ago" }

  
  ]);

  const initialRegion = {
    latitude: 50.261111,
    longitude: 22.419444,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const school = {
    name: "Lokalizacja podopiecznego",
    latitude: 50.261111,
    longitude: 22.419444,
    logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftoppng.com%2Fuploads%2Fpreview%2Fmap-marker-icon-600x-map-marker-11562939743ayfahlvygl.png&f=1&nofb=1&ipt=7a186c12ad84c09acb0b7a1ebdf2e9eb9713d3359cd5076064038c3e4adbfa23&ipo=images",
  };

  return (
    <>
      <SafeAreaView style={styles.mapa}>
        <MapView style={styles.map} initialRegion={initialRegion} provider="google">
          <Marker
            coordinate={{
              latitude: school.latitude,
              longitude: school.longitude,
            }}
            title={school.name}
          >
            <View style={styles.customMarkerContainer}>
              <Image source={{ uri: school.logo }} style={styles.customMarkerImage} />
            </View>
          </Marker>
        </MapView>
      </SafeAreaView>

      <ScrollView style={styles.notificationContainer}>
        {destinations.map((destination) => (
          <View key={destination.id} style={styles.notification}>
            <MaterialIcons name={"place"} size={24} color={"#1ee868"} />
            <Text style={styles.notificationText}>{destination.localisation}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    flex: 2,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  customMarkerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  customMarkerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  notificationContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderColor: 'green',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  notificationText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default MapScreen;
