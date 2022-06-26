import { useFocusEffect } from "@react-navigation/native";
import React, { useRef,useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {  apiKey } from "@env";


// This screen is used to obtain restaurant data during add review
const RestaurantGetScreen = ({navigation}) => {
  const googlePlaceAutoCompleteRef = useRef(null)
  const [result, setResult] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);

  // Reinitialise result for next search
  useFocusEffect(React.useCallback(() => {
    setResult(null);
  }, []));

  // Button to transfer details to database # Method 1
  const rightButton = () => {
    return (
      <Button
            title='Select'
            onPress={() => {}}
      />
    )
  }

  return (
    <View style={{flex: 1}}>
      <GooglePlacesAutocomplete
        minLength={3}

        styles={{flex:1}}
        placeholder='Restaurant'
        fetchDetails={true}
        enablePoweredByContainer={false}
        textInputProps={{
          // Text Prop to decide what to do with input
          // onChangeText does not update on press
          clearTextOnFocus: true
        }}
        onPress={(data, details) => {
          // 'details' is provided when fetchDetails = true
          // Method 2: Push data to database once user click on the restaurant suggestion
          const result = details;
          setResult(result);
          console.log(result.name)
          console.log(result.place_id)
          navigation.navigate("AddReviews", {restaurantResult: result})
          
        }}
        // Query stuff probably dont touch but might be possible to add more types to ensure we dont leave out anything
        // Do msg me if u got any suggestion
        query={{
          key: apiKey,
          language: 'en', 
          components: 'country:sg',
          type: 'restaurant'
        }}
      />
      <TouchableOpacity style={styles.addRestaurantButton}>
        <Text style={styles.addRestaurantText}> 
          Can't find the restaurant you are looking for?
        </Text>
        <Text style={styles.addRestaurantText}> Add it here! </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantGetScreen;

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
  }
})