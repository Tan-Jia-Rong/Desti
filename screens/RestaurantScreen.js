import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import {  apiKey } from "@env";
import { storage, db } from "../firebase";
import { collection, getDocs, query, doc, getDoc, deleteDoc, where, orderBy, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { DetailFragment, RestaurantReviewFragment} from "../components"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";

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
    const {user} = useContext(AuthContext);
    const [errormsg, setErrorMsg] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ourRating, setOurRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState(null);
    const [bookmarkStatus, setBookmarkStatus] = useState(false);
    const [tags, setTags] = useState([])
    

    // To do: Fetch Bookmark and check if restaurant exist in user's bookmark and update bookmark status
    const fetchBookmark = async () => {
        const bookmarkRef = doc(db, "userBookmarks", user.uid);
        const bookmarkSnap = await getDoc(bookmarkRef);

        // If user already has a bookmark collection 
        if (bookmarkSnap.exists()) {
            const obj = bookmarkSnap.data();
            for (const property in obj) {
                // If user has already bookmarked current restaurant
                if (property === placeId) {
                    setBookmarkStatus(true);
                    break;
                }
            } 
        } else {
            setBookmarkStatus(false);
        }
    }
  
    // Update bookmark on user's database
    const updateBookmark = async () => {
     const bookmarkRef = doc(db, "userBookmarks", user.uid);
     const bookmarkSnap = await getDoc(bookmarkRef);

      // If user already has a bookmark collection 
      if (bookmarkSnap.exists()) {
        // If user does not have current restaurant bookmarked yet, we add it into his collection
        if (!bookmarkStatus) {
            setDoc(bookmarkRef, {
                [placeId]: photo
            }, {
                merge: true
            });
        // Else if the user already has current restaurant bookmarked, we remove it from his collection    
        } else {
            await updateDoc(bookmarkRef, {
                [placeId]: deleteField()
            });
        }
      // Else if the user does not have currently have a bookmark collection
      } else {
        await setDoc(bookmarkRef, {
            [placeId]: true
        })
     }
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

    const fetchTags = async () => {
        console.log("placeId is: " + placeId)
        const restaurantTagsRef = doc(db, 'RestaurantTags', placeId);
        const restaurantTagsSnap = await getDoc(restaurantTagsRef);

        if (restaurantTagsSnap.exists()) {
            const obj = restaurantTagsSnap.data();
            let firstLargest = 0;
            let firstLargestTag = ''
            let secondLargest = 0;
            let secondLargestTag = ''
            let thirdLargest = 0;
            let thirdLargestTag = ''
            // Get the top three tags of the restaurant
            for (let i = 0; i < Object.entries(obj).length; i++) {
                if (Object.entries(obj)[i][1]> firstLargest) {
                    thirdLargest = secondLargest;
                    thirdLargestTag = secondLargestTag;
                    secondLargest = firstLargest;
                    secondLargestTag = firstLargestTag
                    firstLargest = Object.entries(obj)[i][1];
                    firstLargestTag = Object.entries(obj)[i][0];
                  } else if (Object.entries(obj)[i][1] > secondLargest) {
                    thirdLargest = secondLargest;
                    thirdLargestTag = secondLargestTag;
                    secondLargest = Object.entries(obj)[i][1];
                    secondLargestTag =  Object.entries(obj)[i][0];
                  } else if (Object.entries(obj)[i][1] > thirdLargest) {
                    thirdLargest = Object.entries(obj)[i][1];
                    thirdLargestTag = Object.entries(obj)[i][0];
                  }
            }
            console.log("First largest tag is: " + firstLargestTag + " with a count of " + firstLargest);
            console.log("Second largest tag is: " + secondLargestTag + " with a count of " + secondLargest);
            console.log("Third largest tag is: " + thirdLargestTag + " with a count of " + thirdLargest);
            let arr = [firstLargestTag, secondLargestTag, thirdLargestTag];
            // Filter out empty tags
            arr = arr.filter(c => c !== '');
            arr.sort();
            setTags(arr);
        }
    }



    // FetchBookmark also
    useEffect(() => {
        fetchTags();
        fetchBookmark();
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
            
            <View style={{width:'100%'}}>
                <TouchableOpacity
                    style={styles.buttonLeftContainer}
                    onPress={() => {
                        navigation.navigate("Map", { destination, address, name })}}
                >
                    <MaterialCommunityIcons name="directions" size={30} color={"white"}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonMidContainer}
                    onPress={() => { navigation.navigate("AddOtherReviews", {result})}}
                >
                    <Text style={styles.reviewText}> Add Review </Text>
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
    buttonMidContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 20,
        height: 50,
        width: 150,
        backgroundColor: '#4287f5',
        borderRadius: 50,
    },
    reviewText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
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