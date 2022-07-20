import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { storage, db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, orderBy, setDoc } from "firebase/firestore";
import { FormInput, RestaurantProfileButton } from '../components';
import { AuthContext } from "../navigation/AuthProvider";
import { apiKey } from '@env';

// This screen shows a list of restaurants which satisifes the search by filter requirments
const ListOfRestaurantsScreen = ({ navigation, route }) => {
  const tags = ["Asian","Bars", "Beef", "Breakfast", "Buffet", "Burger", "Cafes", "Chicken", "Chinese", "Desserts", 
  , "Dinner", "Drink", "French", "Fried", "Indian", "Italian",  "Halal", "Healthy",
  "HotPot", "Japanese", "Korean", "LightBites","Malay", "Mexican", "Mookata", "Mutton",
  "Pasta", "Pizza", "Pork", "Ramen", "Salad", "SeaFood", "Spanish", "Steak", "Supper", "Sushi", "Takeaway", "Thai", "Turkish",
  "Vegetarian", "Western"];
    const rating = route.params.rating;
    const userPriceLevel = route.params.priceLevel;
    // Selected is an array of tags
    const selected = route.params.selected;
    const [restaurants, setRestaurants] = useState([]);
    const [fetchingRestaurants, setFetchingRestaurants] = useState(true);

    useEffect(() => {
    fetchRestaurants();
    }, [])

    const fetchRestaurants = async () => {
        try {
            // First, filter by rating
            const q = query(collection(db, "Restaurants"), where("averageRating", ">=", route.params.rating));
            const querySnapshot = await getDocs(q);
            const arr = [];
            // Can't use forEach loop here due to it being not compatible with async operations
            for (let i = 0; i < querySnapshot.docs.length; i++) {
                const { priceLevel, name } = querySnapshot.docs[i].data();
                // Second, filter by price level
                if (userPriceLevel >= priceLevel) {

                  // Lastly, filter by tags
                  if (selected.length !== 0) {
                    const restaurantTagsRef = doc(db, 'RestaurantTags', querySnapshot.docs[i].id);
                    const restaurantTagsSnap = await getDoc(restaurantTagsRef);
  
                    if (restaurantTagsSnap.exists()) {
                      const obj = restaurantTagsSnap.data();
                      let firstLargest = 0;
                      let firstLargestTag = ''
                      let secondLargest = 0;
                      let secondLargestTag = ''
                      let thirdLargest = 0;
                      let thirdLargestTag = ''
  
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
                      selected.every(item => {
                        if (item === firstLargestTag || item === secondLargestTag || item === thirdLargestTag) {
                          arr.push({
                            id: querySnapshot.docs[i].id,
                            name
                        });
                        return false;
                        } else {
                          return true;
                        } 
                      });
                    }
                  } else {
                    arr.push({
                      id: querySnapshot.docs[i].id,
                      name
                  });
                }
              }
            };

            console.log("arr is: " + arr);
            arr.sort((a, b) => {
                if (a.name <= b.name) {
                    return -1;
                } else {
                    return 1;
                }
            })
            setRestaurants(arr);
            setFetchingRestaurants(false);
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
      <View>
      {fetchingRestaurants ? (
        <View style={{justifyContent: "center", alignItems: "center"}}>
           <Text>Fetching restaurants...</Text>
           <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
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
    </View>
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