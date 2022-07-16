import { useContext, useState, useEffect, useRef } from "react"
import { Text, View, StyleSheet, Image, ActivityIndicator, Alert, Dimensions } from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp, doc, setDoc, updateDoc, getDoc, arrayUnion, increment, query, where, getDocs } from "firebase/firestore";
import * as Location from "expo-location";
import { apiKey } from '@env';

const RouletteScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [location, setLocation] = useState(null);
  const [runningAlgo, setRunningAlgo] = useState(false);
  const [loadingIndicatorText, setLoadingIndicatorText] = useState('');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  
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

  // useEffect to get user location to proceed with nearbysearch
  useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync(); // request permission if not granted
        if(status !== 'granted') {
          setErrorMsg("Permission to access location not granted");
          console.log(errorMsg);
          return; // returning here causes location to be null
        }

        console.log("Location Permission Granted!") // Check that location is granted 
      })();
    }, []);


  // Get array of 20 place id
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
      const data = await handlePlaceId(place_id);
      const result = data.result;

      console.log("Hi result is: " +  result)
      return result;
  }


  const getPersonalizedRecommendation = async () => {
    const userPrefRef = doc(db, 'userPreferences', user.uid);
    const userPrefSnap = await getDoc(userPrefRef);
    

    if (userPrefSnap.exists()) {
      setRunningAlgo(true);
      setLoadingIndicatorText("Getting location...");
       // Await location to be obtained
       let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
       console.log("Obtained Location");

       // update state of location
       setLocation(location);
      console.log("location is :" + location)

      setLoadingIndicatorText("Analysing your preferences...");
      const obj = userPrefSnap.data();
      console.log(obj)
      let firstLargest = 0;
      let firstLargestTag = 'lol'
      let secondLargest = 0;
      let secondLargestTag = 'lol'


      let thirdLargest = 0;
      let thirdLargestTag = 'lol'

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
      

      console.log("firstLargest is : " + firstLargest + " and its tag is: " + firstLargestTag);
      console.log("secondLargest is : " + secondLargest + " and its tag is: " + secondLargestTag);
      console.log("thirdLargest is : " + thirdLargest + " and its tag is: " + thirdLargestTag);

      if (firstLargestTag === 'lol' || secondLargestTag === 'lol' || thirdLargestTag === 'lol') {
        Alert.alert("Not enough personal data\nAdd more restaurant tags in your reviews!");
        setRunningAlgo(false);
        return null;
      }

      const restaurantArr = await getRestaurantArray(location.coords.latitude, location.coords.longitude);
      setLoadingIndicatorText("Finding a suitable restaurant near you...");
      let maxSum = 0;
      let maxSumRestaurantPlaceId = ''
      for (let i = 0; i < restaurantArr.length; i++) {
        const restaurantTagsRef = doc(db, 'RestaurantTags', restaurantArr[i]);
        const restaurantTagsSnap = await getDoc(restaurantTagsRef);
        const restaurantRef = doc(db, 'Restaurants', restaurantArr[i]);
        const restaurantSnap = await getDoc(restaurantRef);

        if (restaurantTagsSnap.exists() && restaurantSnap.exists()) {
          const { averageRating } = restaurantSnap.data();
          const obj = restaurantTagsSnap.data();
          const calculatedSumForCurrentRestaurant = (obj[firstLargestTag] * 3 + obj[secondLargestTag] * 2 + obj[thirdLargestTag] * 1) * averageRating;
          console.log("calculated sum is: " + calculatedSumForCurrentRestaurant)
          if (calculatedSumForCurrentRestaurant > maxSum) {
            maxSum = calculatedSumForCurrentRestaurant;
            maxSumRestaurantPlaceId = restaurantArr[i];
            console.log("Updated maxSumPlaceId to be: " + maxSumRestaurantPlaceId)
          }
        }
      }

        if (maxSumRestaurantPlaceId == '') {
          Alert.alert("Nearby restaurants not enough data");
          setRunningAlgo(false);
        } else {
          console.log("Final is: " + maxSumRestaurantPlaceId)
          const result = await getRestaurantDetails(maxSumRestaurantPlaceId);
          console.log(result);
          setRunningAlgo(false);
          navigation.navigate("Restaurant Screen", { result });

        }
      
    } else {
      console.log("No userPref Document");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: '#333333', fontWeight: 'bold'}}>Unsure of what to eat?</Text>
        <Image 
        style={{width: windowWidth * 0.85, height: windowHeight * 0.5}}
        source={require('../assets/personalizedIcon.png')}
        />
        <Text style={{fontSize: 20, color: '#333333', fontWeight: 'bold', justifyContent: 'center', textAlign: 'center'}}>Use our smart personalized algorithm!</Text>
        {runningAlgo ? (
          <View style={{justifyContent: "center", alignItems: "center"}}>
           <Text>{loadingIndicatorText}</Text>
           <ActivityIndicator size='large' color='#0000ff' />
          </View> 
        ) : (
          <View style={{justifyContent: 'center', alignItems: 'center', alignSelf:'center'}}>
            <FormButton 
              buttonTitle='Get Personalized Recommendation'
              onPress={getPersonalizedRecommendation}
            />
        </View>
        )
        }
    </View>
  );
}

export default RouletteScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
})