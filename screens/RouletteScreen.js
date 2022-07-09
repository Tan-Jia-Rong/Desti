import { useContext, useState } from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp, doc, setDoc, updateDoc, getDoc, arrayUnion, increment, query, where, getDocs } from "firebase/firestore";

const RouletteScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [value, setValue] = useState(0);  

  const getPersonalizedRecommendation = async () => {
    const userPrefRef = doc(db, 'userPreferences', user.uid);
    const userPrefSnap = await getDoc(userPrefRef);

    if (userPrefSnap.exists()) {
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

      const querySnapshot = await getDocs(collection(db, 'RestaurantTags'));
      let maxSum = 0;
      let maxSumRestaurantPlaceId = ''

        for (let i = 0; i < querySnapshot.docs.length; i++) {
          const document = querySnapshot.docs[i];
          const restaurantRef = doc(db, 'Restaurants', document.id);
          const restaurantSnap = await getDoc(restaurantRef);
  

          const obj = document.data();
          const { averageRating } = restaurantSnap.data();
          const calculatedSumForCurrentRestaurant = (obj[firstLargestTag] * 3 + obj[secondLargestTag] * 2 + obj[thirdLargestTag] * 1) * averageRating;
          console.log("calculated sum is: " + calculatedSumForCurrentRestaurant)
          if (calculatedSumForCurrentRestaurant > maxSum) {
              maxSum = calculatedSumForCurrentRestaurant;
              maxSumRestaurantPlaceId = document.id;
              console.log("Updated maxSumPlaceId to be: " + maxSumRestaurantPlaceId)
            }
          
        }
        if (maxSumRestaurantPlaceId == '') {
          console.log("No nearby restaurants has fitting requirments yet")
        } else {
          const result = {place_id: maxSumRestaurantPlaceId}
          console.log("Final is: " + maxSumRestaurantPlaceId)
        }
      
    }
  }

  return (
    <View style={styles.container}>
        <Image 
        style={{width: 400, height: 300}}
        source={{uri: "https://c.tenor.com/TsTxTJzoxgQAAAAC/chow-yun-fat-clap.gif"}}
        />

        <Text style={styles.text}>Roulette Screen</Text>

        <Text style={styles.text}>Score 50 to win!</Text>

        <Text style={styles.text}>you've rolled {value}</Text>
        <FormButton 
          buttonTitle='Roll'
          onPress={getPersonalizedRecommendation}
        />
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
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
})