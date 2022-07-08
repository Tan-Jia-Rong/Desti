
// Handles the fetching of data from google nearbysearch api

import { useState, useEffect } from "react";
import * as Location from "expo-location"
import { NavigationContainer } from "@react-navigation/native";

// Returns result of 20 nearest restaurant
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
// Returns detailed results of a single restaurant
const handlePlaceId = async (place_id) => {
const url = 'https://maps.googleapis.com/maps/api/place/details/json?';
const placeid = `place_id=${place_id}`;
const key = `&key=${apiKey}`;
const placeUrl = url + placeid + key;
const result = await fetch(placeUrl).then(response => response.json());
return result;
}

// How to use

// 1. Initialise variables
const [location, setLocation] = useState(null);

// 2. useEffect to get user location to proceed with nearbysearch
useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // request permission if not granted
      if(status !== 'granted') {
        setErrorMsg("Permission to access location not granted");
        console.log(errorMsg);
        return; // returning here causes location to be null
      }

      console.log("Location Permission Granted!") // Check that location is granted 

      // Await location to be obtained
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
      console.log("Obtained Location");

      // update state of location
      setLocation(location);
      console.log(location);
    })();
  }, []);

  // 2. get array of 20 place id
const getRestaurantArray = async (latitude, longitude) => {
    // Variable to store place_id
    const arr = [];
    // Fetches 20 restaurant
    const data = await handleRestaurantSearch(latitude, longitude);
    const restaurantList = data.results;

    // map every item in restaurantList into proper array can check if its empty first tho
    restaurantList.map((restaurant) => (
        arr.push(restaurant.place_id)
    ));

    // return true to check if it works
    return arr;
}

// 3. Your magical algorithm

// 4. Once one restaurant is selected shld be in some 
const getRestaurantDetails = async (place_id) => {
    const data = handlePlaceId(place_id);
    const result = data.results;

    return result;
}

// To put it together after the useEffect
const onPressHandler = async () => {
    if(location === null) {
        // Just thought we can create 1 error page would be cool right
        navigation.navigate("ErrorPage", {errorMsg});
    } else {
        // get array of 20 place id
        const restaurantplaceIds = getRestaurantArray(location.coords.latitude, location.coords.longitude)

        // Do something to get the 1 restaurant
        const theChosenRestaurant = restaurantplaceIds[i] // for i from 0 <= i < 20

        // get restaurantDetails
        const result = getRestaurantDetails();

        navigation.navigate("RestaurantScreen", {result});
    }
}
