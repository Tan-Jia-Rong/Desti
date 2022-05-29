import { useContext, useState } from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { FormButton, FormInput } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const SettingsScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {username, setUsername} = useState();

  return (
    <View style={styles.container}>
        <Image 
          source={{uri: 'https://assets.change.org/photos/8/jw/ax/QMjwAxeQAfcpoxs-800x450-noPad.jpg?1597557421'}}
          style={styles.profilePicture} 
          />
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
          onPress={() => navigation.navigate("Profile")}
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
    color: '#333333',
    paddingTop: 20,
  },
  profilePicture: {
    height: 150,
    width: 150,
    borderRadius: '100',
  }
})