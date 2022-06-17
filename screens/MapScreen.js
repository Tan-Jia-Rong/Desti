import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"
import { useEffect, useState } from 'react';
import Polyline from '@mapbox/polyline';
import { apiKey } from '@env';

const { width, height } = Dimensions.get('screen');

const MapScreen = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [address, setAddress] = useState(null);
  const [time, setTime] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [restaurantList, setRestaurantList] = useState([]);
  const [visibility, setVisibility] = useState(false);

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
    setCoords(coords);
    setDistance(distance);
    setTime(time);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  const onMarkerPress = (location, address) => {
      setDestination(location);
      setAddress(address)
      mergeCoords();
  }

  const mergeCoords = () => {
    const hasStartAndEnd = location != null && destination !== null;

    if(hasStartAndEnd) {
      const concatStart = `${location.coords.latitude},${location.coords.longitude}`;
      const concatEnd = `${destination.lat},${destination.lng}`
      getDirections(concatStart,concatEnd);
    }
  }

  const renderMarkers = (restaurantList) => {
    return (
      restaurantList.map((item) => (
        <Marker
          title={item.name}
          description= {'Rating ' + item.rating + ' / 5.0'}
          icon={{
            uri: item.icon
            }}
          key={item.place_id}
          coordinate={{
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          }}
          onPress={() => onMarkerPress(item.geometry.location, item.vicinity)}
        />
      )))
  }

  const renderPolyLine = () => {
      return (
      <MapView.Polyline
        strokeWidth={2}
        strokeColor="red"
        coordinates={coords}
      />)
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log(errorMsg);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 50
      },
        async (location) => {
          console.log('update location!', location.coords.latitude, location.coords.longitude)
          setLocation(location);

          mergeCoords();

          let restaurantList = await handleRestaurantSearch(location.coords.latitude, location.coords.longitude);
          setRestaurantList(restaurantList.results);
        }
      )
    })();
  }, []);

  if (location === null) return (
    <View style={styles.container}>
      <Text> {errorMsg} </Text>
    </View>
  );
  
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
        
        <Text style={{ fontWeight: 'bold' }}>Estimated Time: {visibility ? time : null}</Text>
        <Text style={{ fontWeight: 'bold' }}>Estimated Distance: {visibility ? distance : null}</Text>
        <Text>Address: {address}</Text>
      </View>

      <MapView
        showsUserLocation
        showsMyLocationButton
        style={{
          flex: 1
        }}
      >

      {renderMarkers(restaurantList)}

      {coords !== null && visibility === true && renderPolyLine(coords)}
    </MapView>

    <Button
      title='Get Directions!'
      style={{
        position: 'absolute',
        top: '95%',
        alignSelf: 'center'
      }}
      onPress={() => {
        setVisibility(true);
        mergeCoords();
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
});
