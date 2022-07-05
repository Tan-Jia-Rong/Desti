import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Button, Image} from 'react-native';
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"
import { useEffect, useRef, useState } from 'react';
import Polyline from '@mapbox/polyline';
import { apiKey } from '@env';
import DestiMarker from '../assets/DestiMarker.png'
import DestiNewMarker from '../assets/DestiNewMarker.png'
import { async } from '@firebase/util';

const { width, height } = Dimensions.get('screen');

const MapScreen = ({navigation}) => {
  // Ref for Map
  const [mapRef, setMapRef] = useState(null);
  // Initialise states
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [address, setAddress] = useState(null);
  const [name, setName] = useState(null);
  const [time, setTime] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [restaurantList, setRestaurantList] = useState([]);
  const [coords, setCoords] = useState(null);
  const [placeid, setPlaceId] = useState(null);
  const [result, setResult] = useState([]);

  const getnSetBoundaries = () => {
    if (mapRef === null) return;

    mapRef.setMapBoundaries({latitude: location.coords.latitude + 0.02, longitude: location.coords.longitude + 0.02},
                            {latitude: location.coords.latitude - 0.02, longitude: location.coords.longitude - 0.02})
  }

  // Handles the fetching of data from google nearbysearch api
  const handleRestaurantSearch = async (latitude, longitude) => {
    const url  = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
    const location = `location=${latitude},${longitude}`;
    const radius = '&radius=2000';
    const type = '&keyword=restaurant';
    const key = `&key=${apiKey}`;
    const restaurantSearchUrl = url + location + radius + type + key;
    const result = await fetch(restaurantSearchUrl).then(response => response.json());
    return result;
  };

  // Fetches places details using placeId
  const handlePlaceId = async (place_id) => {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?';
    const placeid = `place_id=${place_id}`;
    const key = `&key=${apiKey}`;
    const placeUrl = url + placeid + key;
    const result = await fetch(placeUrl).then(response => response.json());
    return result;
  }

  // Handles the fetchinig of data from google direction api
  const getDirections = async (start, end) => {
    const url = 'https://maps.googleapis.com/maps/api/directions/json?'
    const origin = `origin=${start}`
    const destination = `&destination=${end}`
    const key = `&key=${apiKey}`
    const getDirectionUrl = url + origin + destination + key;
    try {
    const result = await fetch(getDirectionUrl).then(response => response.json());
    const response = result.routes[0];
    const distanceTime = response.legs[0];
    const distance = distanceTime.distance.text;
    const time = distanceTime.duration.text;
    const points = Polyline.decode(response.overview_polyline.points);
    const coords = points.map(point => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    });
    console.log("Updating coords");
    setCoords(coords);
    setDistance(distance);
    setTime(time);
    console.log("Finish setting coords")
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  // Update state of destination and address once marker is pressed
  const onMarkerPress = (location, address, name, place_id) => {
    console.log("onmarker press procs")
    // Reinitialise state
    setName(name);
    setDestination(location);
    setAddress(address);
    setTime(null);
    setDistance(null);
    setPlaceId(place_id);
}

  // Get Direction from user to selected restaurant
  const mergeCoords = async () => {
    console.log("mergeCoords procs")
    const hasStartAndEnd = location != null && destination !== null;

    if(hasStartAndEnd) {
      const concatStart = `${location.coords.latitude},${location.coords.longitude}`;
      const concatEnd = `${destination.lat},${destination.lng}`
      const result = await getDirections(concatStart,concatEnd);
      return;
    }
  }

  // Renders markers of nearby restaurants <- capped at 20 restaurant as per google api
  const renderMarkers = (restaurantList) => {
    return (
      restaurantList.map((item) => (
        <Marker
          title={item.name}
          description= {'Rating ' + item.rating + ' / 5.0'}
          key={item.place_id}
          coordinate={{
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          }}
          onPress={() => onMarkerPress(item.geometry.location, item.vicinity, item.name, item.place_id)}
        >
          <Image
            source={DestiMarker}
            style={styles.markerStyle}
          />
        </Marker>
      )))
  }

  // Renders the path from user location to selected restaurant
  const renderPolyLine = () => {
      return (
      <MapView.Polyline
        strokeWidth={2}
        strokeColor="blue"
        coordinates={coords}
      />)
  }

  // Check if location is granted
  // Issue: Cant check if user deny in the first time
  // Possible solution: 
  // 1. Deal with logic when location === null
  // 2. Deal with logic with useEffect <- cant find any solutioins yet
  useEffect(() => {
    console.log("useEffect Triggered");
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted') {
        setErrorMsg("Permission to access location not granted");
        console.log(errorMsg);
        return;
      }
      console.log("Location Permission Granted!")
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
      console.log("Obtained Location");
      setLocation(location);
      console.log(location);

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 50,
        
      },
        async (location) => {
          console.log('update location!', location.coords.latitude, location.coords.longitude)
          setLocation(location);

          console.log("Merging Coords");
          await mergeCoords();

          console.log("Finding nearby restaurant");
          let restaurantList = await handleRestaurantSearch(location.coords.latitude, location.coords.longitude);
          setRestaurantList(restaurantList.results);
        }
      )

      console.log("Getting ready to set boundaries");
      getnSetBoundaries();
    })();
  }, []);

  // Text to show if location denied / loading of maps
  if (location === null) return (
    <View style={styles.container}>
      <Text> {errorMsg === null ? "Loading..." : errorMsg} </Text>
    </View>
  );
  
  // MapView is location services is granted
  if (location) {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          width,
          paddingTop: 10,
          alignSelf: 'center',
          alignItems: 'center',
          height: height * 0.10,
          backgroundColor: 'white',
          justifyContent: 'flex-end',
        }}>
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>
        <Text style={{ fontWeight: 'bold' }}>Estimated Time: {time}</Text>
        <Text style={{ fontWeight: 'bold' }}>Estimated Distance: {distance}</Text>
        <Text>Address: {address}</Text>
      </View>

      <MapView
        ref={(ref) => setMapRef(ref)}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        }}
        onUserLocationChange={() => getnSetBoundaries()}
        onMapReady={() => getnSetBoundaries()}
        // Was planning on displaying all the markers in our database instead of nearby
        style={{
          flex: 1
        }}
      >

      {renderMarkers(restaurantList)}

      {coords !== null && renderPolyLine()}
    </MapView>

    <Button
      title='Get Directions!'
      style={{
        position: 'absolute',
        top: '95%',
        alignSelf: 'center'
      }}
      onPress={async () => {
        await mergeCoords();
      }}/>
    <Button
    title='Restaurant'
    style={{
      position: 'absolute',
      top: '95%',
      alignSelf: 'center'
    }}
    onPress={async () => {
      const data = await handlePlaceId(placeid);
      setResult(data.result);
      console.log(result);
      navigation.navigate("RestaurantScreen", {result});
    }}/>
  </View>
  )}
}

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerStyle: {
    width: 50,
    height: 50,
  }
});
