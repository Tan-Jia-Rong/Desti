import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { storage, db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { FormInput, RestaurantProfileButton } from '../components';
import { AuthContext } from "../navigation/AuthProvider";
import { apiKey } from '@env';

const ListOfRestaurantsScreen = ({ navigation, route }) => {
    const rating = route.params.rating;
    const userPriceLevel = route.params.priceLevel;
    // Selected is an array of tags
    const selected = route.params.selected;
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
    fetchRestaurants();
    }, [])

    const fetchRestaurants = async () => {
        try {
            const q = query(collection(db, "Restaurants"), where("averageRating", ">=", route.params.rating));
            const querySnapshot = await getDocs(q);
            const arr = [];
            querySnapshot.forEach((doc) => {
                const { priceLevel, name } = doc.data();
                if (userPriceLevel >= priceLevel) {
                    arr.push({
                        id: doc.id,
                        name
                    })
                }
            });

            arr.sort((a, b) => {
                if (a.name <= b.name) {
                    return -1;
                } else {
                    return 1;
                }
            })
            setRestaurants(arr);
        } catch(e) {
            console.log(e);
        }
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

  const handleOnPress = async (place_id) => {
    const data = await handlePlaceId(place_id);
    const result = data.result;
    navigation.navigate("RestaurantScreen", { result });
  }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <View styles={styles.inner}>
          <FlatList
            onScroll={() => Keyboard.dismiss()}
            numColumns={1}
            horizontal={false}
            data={restaurants}
            renderItem={({item}) => <RestaurantProfileButton item={item} onPress={() => handleOnPress(item.id)}/>}
          />

        </View>
      </View>
    </TouchableWithoutFeedback>
    )
}

export default ListOfRestaurantsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
      backgroundColor: '#f8f8f8',
      alignSelf: 'stretch',
      marginBottom: 20,
      borderRadius: 10
    },
    userInfo: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 15
    },
    userImg: {
      width: 50,
      height: 50,
      borderRadius: 25
    },
    userInfoText: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 10
    },
    userName : {
      fontSize: 14,
      fontWeight: 'bold'
    }
  });