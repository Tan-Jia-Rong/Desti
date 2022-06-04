import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { apiKey } from '@env';

const RestaurantScreen = () => {
    const [hasLocationPermission, setLocationPermission] = useState(false);
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [restaurantList, setRestaurantList] = useState([]);

    const getLocationAsync = async () => {
        const {status} = await Permissions.askAsync(
            Permissions.LOCATION_FOREGROUND
        );

        if(status == 'granted') {
            let location = await Location.getCurrentPositionAsync({});
            setLocationPermission(true);
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
        } else {
            alert('Location permission not granted');
        }
    };

    useEffect(() => {
        getLocationAsync();
    }, []);

    const handleRestaurantSearch = () => {
        const url  = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
        const location = `location=${latitude},${longitude}`;
        const radius = '&radius=2000';
        const type = '&keyword=restaurant';
        const key = '&key=' + apiKey;
        const restaurantSearchUrl = url + location + radius + type + key;
        fetch(restaurantSearchUrl)
        .then(response => response.json())
        .then(result => setRestaurantList(result))
    }

    console.log(longitude, latitude);
    console.log(restaurantList);

    return (
        <View style={styles.container}>
        <FlatList
        data = {restaurantList.results}
        keyExtractor = {(item) => item.place_id}
        renderItem ={({item}) => (
            <Text>{item.name}</Text>
        )}
        style={styles.listText}
        />
        <TouchableOpacity
            onPress={() => handleRestaurantSearch()}
        >
            <Text style={styles.text}>Search Restaurants</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
        </View>
    );
}

export default RestaurantScreen;
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        backgroundColor: 'grey',
        color: 'white',
        padding: 5,
        marginBottom: 50,
    },
    listText: {
        backgroundColor: 'grey', 
        width: '80%', 
        margin: 60, 
        padding: 5,
    }
});