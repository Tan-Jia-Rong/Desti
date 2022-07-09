import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import {  apiKey } from "@env";
import { storage, db } from "../firebase";
import { collection, getDocs, query, doc, getDoc, deleteDoc, where, orderBy } from "firebase/firestore";
import { DetailFragment, RestaurantReviewFragment} from "../components"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from "react-native";

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const RestaurantScreen = ({navigation, route}) => {
    // Get params from previous Screen
    const { result } = route.params;
    const name = result.name;
    const address = result.formatted_address;
    const destination = result.geometry.location;
    const phoneNumber = result.formatted_phone_number;
    const openingArr = result.opening_hours;
    const priceLevel = result.price_level;
    const ratings = result.rating;
    const placeId = result.place_id;

    // Other variables
    const [errormsg, setErrorMsg] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ourRating, setOurRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState(null);
    const [bookmarkStatus, setBookmarkStatus] = useState(false);
    const [tags, setTags] = useState(['Thai', 'Cupcake', 'IceCream'])
    

    // To do: Fetch Bookmark and check if restaurant exist in user's bookmark and update bookmark status
    const fetchBookmark = async () => {
    try {
        // To check if already bookedmarked in
        const bookmarkArr = [];
        const q = query(collection(db, 'Bookmarks'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const { place_id, name, image } = doc.data();
            if (place_id === placeId) setBookmarkStatus(true);
        }, []);   
    } catch(e) {
        console.log(e);
    }
    }
  
    // Update bookmark on user's database
    const updateBookmark = async () => {
    }

    const fetchReviews = async () => {
        try {
            const restaurantRef = doc(db, 'Restaurants', placeId);
            const restaurantSnap = await getDoc(restaurantRef);

            // If there is at least one review done by our app users
            if (restaurantSnap.exists()) {
                const {averageRating, postsThatReviewed} = restaurantSnap.data();
                setOurRating(averageRating.toFixed(1));

                const reviewArr = [];
                const q = query(collection(db, 'Posts'), orderBy('postTime', 'desc'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const { comments, likes, postImg, postText, postTime, rating, userId } = doc.data();
                    if (postsThatReviewed.includes(doc.id)) {
                        reviewArr.push({
                            id: doc.id,
                        });
                    }
                }, []);

                setReviews(reviewArr);
            // Else if there is not even one review done by our app users    
            } else {

            }
          } catch(e) {
            console.log(e);
          }
    }

    // FetchBookmark also
    useEffect(() => {
        // fetchBookmark()
        fetchReviews();
    }, [])
    
    // To-do: update BookmarkStatus
    const onBookmarkPress = async () => {
        await updateBookmark();
        setBookmarkStatus(!bookmarkStatus);
    }

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
        const photo = result.photos === undefined 
                      ? "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png" 
                      :await fetchPhoto(result.photos[0].photo_reference);
        console.log("photo obtained succesfully")
        setPhoto(photo);
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
        <View style={styles.container}>
            <ScrollView horizontal={false}>
                <View style={{flex: 1, width: '100%'}}>
                <Image
                    source={{uri: photo}}
                    style={styles.imageStyle}
                />
                
                <DetailFragment
                    restaurantName={name}
                    tagArr={tags}
                    address={address}
                    openingArr={openingArr}
                    priceLevel={priceLevel}
                    ratings={reviews.length == 0 ? ratings : ourRating}
                    phoneNumber={phoneNumber}
                />

                <View
                    style={{flex: 1}}
                >
                    <RestaurantReviewFragment
                        placeId={result.place_id}
                        navigation={navigation}/>
                </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.buttonLeftContainer}
                onPress={() => {
                    navigation.navigate("Map", { destination, address, name })}}
            >
                <MaterialCommunityIcons name="directions" size={30} color={"white"}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonRightContainer}
                onPress={onBookmarkPress}
            >
            {bookmarkStatus ? 
                <MaterialCommunityIcons name='bookmark-off' size={30} color={"white"}/> : 
                <MaterialCommunityIcons name='bookmark-plus' size={30} color={"white"}/> }
            </TouchableOpacity>
        </View>
    )
}

export default RestaurantScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    imageStyle: {
      flex: 1,
      maxHeight: 200,
      height: 200,
      width: WIDTH,
      maxWidth: WIDTH
    },
    buttonLeftContainer: {
      flex: 1,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 20,
      left: 30,
      height: 50,
      width: 50,
      backgroundColor: '#4287f5',
      borderRadius: 50,
    },
    buttonRightContainer: {
      flex: 1,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 20,
      right: 30,
      height: 50,
      width: 50,
      backgroundColor: '#4287f5',
      borderRadius: 50,
    }
  
  });