import { useContext, useState } from "react"
import { Text, View, StyleSheet } from "react-native"
import { FormButton, FormInput } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const SettingsScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {username, setUsername} = useState();

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Edit Profile</Text>
        <Text style={styles.text}> Username: {user.displayName}</Text>
        <FormInput
                  labelValue = {username}
                  onChangeText = {setUsername}
                  placeHolderText = "Username"
                  iconType = "user"
                  autoCapitalize = "none"
                  autocorrect = {false}
              />


        <FormButton 
          buttonTitle='Save. which does nothing for now'
        />

        <FormButton 
          buttonTitle='Go Back'
          onPress={() => navigation.navigate("Home")}
        />
    </View>
  );
}

export default SettingsScreen;

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