import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { storage, db } from "../firebase";
import { collection, getDocs, query, doc, getDoc, deleteDoc, where, orderBy } from "firebase/firestore";

const DetailFragment = ({address, phoneNumber, openingArr, priceLevel, ratings, location, navigation, name, placeId}) => {
    const [destination, setDestination] = useState(location);
    const [reviews, setReviews] = useState([]);
    const [ourRating, setOurRating] = useState(null);
    const status = openingArr === undefined ? "Not Applicable" : openingArr.open_now;
    const openingDays = openingArr === undefined ? "Not Applicable" : openingArr.weekday_text;
    const [bookmarkStatus, setBookmarkStatus] = useState(false);

    const fetchReviews = async () => {
        try {
            const restaurantRef = doc(db, 'Restaurants', placeId);
            const restaurantSnap = await getDoc(restaurantRef);

            // If there is at least one review done by our app users
            if (restaurantSnap.exists()) {
                const {averageRating, postsThatReviewed} = restaurantSnap.data();
                setOurRating(averageRating);

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

    // To-do: update BookmarkStatus
    const onBookmarkPress = async () => {
        await updateBookmark();
        setBookmarkStatus(!bookmarkStatus);

    }

    // FetchBookmark also
    useEffect(() => {
        // fetchBookmark()
        fetchReviews();
    }, [])

    return (
        <View style={{flex: 1}}>
            <View style={styles.locationContainer}>
                <Text>{address}</Text>
                <Text>Phone: {phoneNumber ? phoneNumber : "Not Applicable"}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Text>Pricing: {priceLevel ? priceLevel + " / 5" : "Not Applicable"}</Text>
                    {reviews.length == 0 ? 
                     <Text>Rating: {ratings} / 5.0</Text> :
                     <Text>Rating: {ourRating} / 5.0</Text>}
                    <Text>Status: {status === undefined ? "Not Applicable"
                                    : status ? "Open" : "Closed"} </Text>
                </View>
                
                <ScrollView style={styles.rightContainer}>
                    
                    <Text>Opening Hours</Text>
                    {
                        openingDays === "Not Applicable" 
                        ? <Text> {openingDays} </Text>
                        : openingDays.map(openingHours => {
                        return <Text key={openingHours}>{openingHours}</Text>;
                    })}
                    
                </ScrollView>
            </View>
            <View style={styles.buttonMainContainer}>
                <TouchableOpacity
                    style={styles.buttonLeftContainer}
                    onPress={() => {
                        navigation.navigate("Map", { destination, address, name })}}
                >
                    <Text style={styles.buttonText}> Get Direction </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonRightContainer}
                    onPress={onBookmarkPress}
                >
                    <Text style={styles.buttonText}> {bookmarkStatus ? "Remove Bookmark" : "Bookmark"} </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DetailFragment;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    locationContainer: {
        flex: 0.2,
        width: '100%',
        alignItems: 'flex-start',
        paddingLeft: 20,
        marginBottom: 20
    },
    leftContainer: {
        height: '100%',
        width: '50%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        paddingLeft: 20,
    },
    rightContainer: {
        flex: 1,
        width: '50%',
        flexDirection: 'row'
    },
    buttonMainContainer: {
        flex: 0.15,
        flexDirection: 'row',
        backgroundColor: '#2e64e5',
        marginTop: 5
    },
    buttonLeftContainer: {
        width: "50%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 2,
        borderRightColor: 'black',
    },
    buttonRightContainer: {
        width: "50%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },

})