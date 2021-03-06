import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image} from 'react-native';
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"
import { useEffect, useState } from 'react';
import DestiMarker from '../assets/DestiMarker.png'
import Polyline from '@mapbox/polyline'
import { apiKey } from '@env'
const { width, height } = Dimensions.get('screen');

const DirectionScreen = ({route, navigation}) => {
  const  { destination, address, name } = route.params;
  const [location, setLocation] = useState(null);
  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDirections = async (start, end) => {
    const url = 'https://maps.googleapis.com/maps/api/directions/json?'
    const origin = `origin=${start}`
    const destination = `&destination=${end}`
    const key = `&key=${apiKey}`;
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

  const mergeCoords = async () => {
    const hasStartAndEnd = location != null && destination !== null;

    if(hasStartAndEnd) {
      const concatStart = `${location.coords.latitude},${location.coords.longitude}`;
      const concatEnd = `${destination.lat},${destination.lng}`
      await getDirections(concatStart,concatEnd);
      return;
    }
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

      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
      setLocation(location);
      setLoading(false);

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 50
      },
        async (location) => {
          console.log('update location!', location.coords.latitude, location.coords.longitude)
          setLocation(location);

          await mergeCoords()
        }
      )
    })();
  }, []);

  if(loading == true) return (
    <View style={styles.container}>
      <Text> Loading... </Text>
    </View>
  )

  else if (location === null) return (
    <View style={styles.container}>
      <Text> {errorMsg ? errorMsg : "I can't seem to find ur location?"} </Text>
    </View>
  );

  else return (
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
        showsUserLocation
        style={{
          flex: 1
        }}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        }}
      >
      <Marker
          coordinate={{
            latitude: destination.lat,
            longitude: destination.lng
          }}
      >
        <Image
            source={DestiMarker}
            style={styles.markerStyle}
          />
      </Marker>

      {coords !== null &&  renderPolyLine(coords)}
    </MapView>

    <TouchableOpacity
      style={styles.directionContainer}
      onPress={async () => { await mergeCoords();}}
    >
      <Text
        style={styles.directionText}
      >
        Directions
      </Text>
    </TouchableOpacity>
  </View>
  )
}

export default DirectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionContainer: {
    position: 'absolute',
    top: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    width: 150,
    backgroundColor: '#4287f5',
    borderRadius: 50,
  },
  directionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  markerStyle: {
    width: 50,
    height: 50,
  }
});
