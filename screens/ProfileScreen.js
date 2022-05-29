import { BottomTabBar } from "@react-navigation/bottom-tabs"
import { useContext } from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const ProfileScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
        <Image 
          source={{uri: 'https://assets.change.org/photos/8/jw/ax/QMjwAxeQAfcpoxs-800x450-noPad.jpg?1597557421'}}
          style={styles.profilePicture} 
          />
        <Text style={styles.text}>Welcome, {user.displayName} </Text>
        
        <FormButton 
          buttonTitle='Settings'
          onPress={() => navigation.navigate("Settings")}
        />

        <FormButton 
          buttonTitle='Logout'
          onPress={() => logout()}
        />
    </View>
  );
}

export default ProfileScreen;

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
    paddingBottom: 20
  },
  profilePicture: {
    height: 150,
    width: 150,
    borderRadius: '100',
  }
})