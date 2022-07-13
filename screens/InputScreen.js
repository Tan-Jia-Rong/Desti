import { useFocusEffect } from "@react-navigation/native";
import React, { useRef,useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Dimensions, ScrollView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {  apiKey } from "@env";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Slider } from "@miblanchard/react-native-slider";
import { windowHeight, windowWidth } from "../utils/dimensions";
import { FormButton, TagButton } from "../components";



const InputScreen = ({navigation}) => {
  const googlePlaceAutoCompleteRef = useRef(null)
  const tags = ["Asian","Bars", "Beef", "Breakfast", "Buffet", "Burger", "Cafes", "Chicken", "Chinese", "Desserts", 
                  , "Dinner", "Drink", "French", "Fried", "Indian", "Italian",  "Halal", "Healthy",
                  "HotPot", "Japanese", "Korean", "LightBites","Malay", "Mexican", "Mookata", "Mutton",
                  "Pasta", "Pizza", "Pork", "Ramen", "Salad", "SeaFood", "Spanish", "Steak", "Supper", "Sushi", "Takeaway", "Thai", "Turkish",
                  "Vegetarian", "Western"];
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  console.log(selected);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [priceLevel, setPriceLevel] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // Reinitialise result for next search
  useFocusEffect(React.useCallback(() => {
    setResult(null);
  }, []));

  // OnPressHandler for Tags
  const onPressHandler = (tag) => {
    const result = addOrRemove(selected, tag);
    setSelected(result);
  }

  // Function to add or remove tags from selected array
  const addOrRemove = (array, item) => {
    console.log("addOrRemove procs")
    const exists = array.includes(item)
    if (exists) {
        console.log("If procs")
        return array.filter((c) => { return c !== item })
    } else {
        const result = array
        console.log("Else procs")
        result.push(item)
        // To ensure user only select 3 tags
        // Suggestion: To remove the limit but set limit when taking data
        if (result.length > 3) {
          alert("You can only select 3 tags MAX");
          return result.filter((c) => { return c !== item })
        }
        // Somehow color does not update when one just return result
        return result.filter(c => {return c});
    }
  }

  // Function to propogate tags
  const makeButtons = () => {
    console.log("button is made")
    return tags.map((tag, i) => {
      const on = selected.includes(tag)
      const backgroundColor = on ? "#7ee6ad" : "#ffffff"
      const textColor = on ? "#ffffff" : "#000000"
      const borderColor = on ? "#7ee6ad" : "#000000"
      return (
        <TagButton
          backgroundColor={backgroundColor}
          textColor={textColor}
          borderColor={borderColor}
          onPressHandler={() => {onPressHandler(tag)}}
          key={i}
          tagName={tag} />
      )
    })
  }

  // Navigate between "search by name" and "search by filter" tabs
  const handleIndexChange = (index) => {
    setSelectedIndex(index);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <SegmentedControlTab
          values={["Search by name", "Search by filter"]}
          selectedIndex={selectedIndex}
          onTabPress={handleIndexChange}
        />
      {selectedIndex === 0 ?
        <GooglePlacesAutocomplete
        minLength={3}
        styles={{flex:1}}
        placeholder='Search'
        fetchDetails={true}
        enablePoweredByContainer={false}
        textInputProps={{
          clearTextOnFocus: true
        }}
        onPress={(data, details) => {
          // 'details' is provided when fetchDetails = true
          const result = details;
          setResult(result);
          navigation.navigate("RestaurantScreen", {result})
        }}
        query={{
          key: apiKey,
          language: 'en', 
          components: 'country:sg',
          type: 'restaurant'
        }}
      /> :
      <View style={styles.sliderContainer}> 
        <View style={{alignItems: 'center', justifyContent: 'center'}}> 
          <Text style={{fontWeight: 'bold'}}>Minimum rating</Text> 
        </View> 
        <Slider 
        value={rating} 
        onValueChange={value => { 
            setRating(value[0]); 
            console.log(value[0]); 
          } 
        } 
        step={0.5} 
        maximumValue={5} 
        thumbTintColor="#fffafa" 
        maximumTrackTintColor="#b7b7b7" 
        minimumTrackTintColor="#1073ff"
        containerStyle={{marginLeft: windowWidth * 0.1, marginRight: windowWidth * 0.1}}
        /> 
        <View style={{alignItems: 'center', justifyContent: 'center'}}> 
          <Text>Minimum Rating specified: {rating}</Text> 
        </View> 
        <View style={styles.Divider}> 
        </View> 
 
        <View style={{alignItems: 'center', justifyContent: 'center'}}> 
          <Text style={{fontWeight: 'bold'}}>Maximum price level</Text> 
        </View> 
        <Slider 
        value={priceLevel} 
        onValueChange={value => { 
            setPriceLevel(value[0]); 
            console.log(value[0]); 
          } 
        } 
        step={1} 
        maximumValue={5} 
        thumbTintColor="#fffafa" 
        maximumTrackTintColor="#b7b7b7" 
        minimumTrackTintColor="#1073ff" 
        containerStyle={{marginLeft: windowWidth * 0.1, marginRight: windowWidth * 0.1}}
        /> 
        <View style={{alignItems: 'center', justifyContent: 'center'}}> 
          <Text>Maximum price level specified: {priceLevel}</Text> 
        </View> 
        <View style={styles.Divider}> 
        </View> 
 
        <View style={{height:windowHeight * 0.3}}> 
          <Text style={styles.reviewTextStyle}>Select up to 3 tags!</Text> 
            <ScrollView nestedScrollEnabled={true}> 
              <View style={styles.tagContainer}> 
                {makeButtons()} 
              </View> 
            </ScrollView> 
          </View> 

          <View style={{justifyContent: 'center', alignItems: 'center', alignSelf:'center', flex: 1}}>
            <FormButton 
              buttonTitle='Search Restaurants'
              onPress={() => {}}
            />
        </View>
      </View> 
      } 
      </View> 
    </TouchableWithoutFeedback> 
  ); 
}; 
 
export default InputScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
  },
  addRestaurantButton: {
    marginVertical: 35,
    alignItems: "center",
  },
  addRestaurantText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
  sliderContainer: {
    flex: 1,
  },
  Divider: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: windowWidth,
    alignSelf: 'center',
    marginTop: 15,
  },
  tagContainer: {
    height:"30%",
    width: "100%",
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  reviewTextStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16
  }
})