import { useFocusEffect } from "@react-navigation/native";
import React, { useRef,useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {  apiKey } from "@env";



const InputScreen = ({navigation}) => {
  const googlePlaceAutoCompleteRef = useRef(null)
  const [result, setResult] = useState(null);

  // Reinitialise result for next search
  useFocusEffect(React.useCallback(() => {
    setResult(null);
  }, []));

  // Search button to pass value to restaurant Screen
  // Cons: currently can only pass value once user click on
  //       results provided by auto complete
  // Solution: Likely to be solved once we shift the data onto our own database
  // Viable Solution: To use our own database instead of google and propagate from there
  const rightButton = () => {
    return (
      <Button
            title='Search!'
            onPress={() => {}}
      />
    )
  }

  return (
    <View style={{flex: 1}}>
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
      />
    </View>
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
  }
})