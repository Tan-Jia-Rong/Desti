import { useContext, useState } from "react"
import { Text, View, StyleSheet, Button } from "react-native"
import { FormButton, FormInput } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const EditProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text></Text>
      <Button
        title='Click Here'
        onPress={() => alrt('Button Clicked!')}
    />
    </View>
  );
}


export default EditProfileScreen;

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
    color: '#333333',
    paddingTop: 20,
  },
  profilePicture: {
    height: 150,
    width: 150,
    borderRadius: 100,
  }
})