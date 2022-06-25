import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Image, Button, ScrollView } from "react-native";
import {  apiKey } from "@env";
import { DetailFragment, RestaurantReviewFragment} from "../components"



const RestaurantScreen = ({route, navigation}) => {
    // Get params from previous Screen
    const { result } = route.params;
    const [errormsg, setErrorMsg] = useState(null);
    const [location , setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState(null);

    // Return photo url from google place photo api
    const fetchPhoto = async (photoRef) => {
        const url  = 'https://maps.googleapis.com/maps/api/place/photo?maxheight=300'
        const photoRefernece = `&photo_reference=${photoRef}`;
        const key = `&key=${apiKey}`;
        const fetchPhotoUrl = url + photoRefernece + key;
        console.log("Fetching photo")
        var xhr = new XMLHttpRequest();
        xhr.open('GET', fetchPhotoUrl, true);
        xhr.onload = () => { setPhoto(xhr.responseURL)};
        xhr.send(null);
        return photo;
      };

    // to be updated everytime the page is visited
    const updateRestaurant = async () => {
        if(!result) {
            setErrorMsg("Oops... Sorry! The restaurant you specified is currently not in our database...")
            console.log("Result not found");
            return;
        }
        console.log("Use effect triggered")
        const photo = await fetchPhoto(result.photos[0].photo_reference);
        console.log("photo obtained succesfully")
        setPhoto(photo);
        const location = result.geometry.location;
        setLocation(location);
        setLoading(false);
    }

    // updateRestaurant with changed values
    useFocusEffect(React.useCallback(() => {
        updateRestaurant();
      }, []));

    // If result is invalid
    if(!result) return (
        <Text> {errormsg} </Text>
    )

    // Await useEffect to finish loading
    while(loading) return (
        <Text> loading... </Text>
    )

    // Return Restaurant Page
    return (
        <ScrollView>
                <Image
                    style={{width: '100%', height: 200}}
                    source={{uri: photo}}
                />
                <View
                    style={{flex: 1}}
                >
                    <DetailFragment
                        address={result.formatted_address}
                        phoneNumber={result.formatted_phone_number}
                        status={result.opening_hours.open_now}
                        openingArr={result.opening_hours.weekday_text}
                        priceLevel={result.price_level}
                        ratings={result.rating}
                        location={location}
                        navigation={navigation}
                    />
                </View>
                <View
                    style={{flex: 1}}
                >
                    <RestaurantReviewFragment/>
                </View>
        </ScrollView>
    )
}

export default RestaurantScreen;