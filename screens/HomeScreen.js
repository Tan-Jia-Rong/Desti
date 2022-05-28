import { useContext } from "react"
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const HomeScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Welcome, {user.displayName} </Text>

        <TouchableOpacity
          style = {styles.settingsButton}
          onPress = {() => navigation.navigate("Settings")}
        >
          <Text style = {styles.navButtonText}>
            Go to Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style = {styles.settingsButton}
          onPress = {() => navigation.navigate("Map")}
        >
          <Text style = {styles.navButtonText}>
            Go to Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style = {styles.settingsButton}
          onPress = {() => navigation.navigate("Roulette")}
        >
          <Text style = {styles.navButtonText}>
            Go to Roulette
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style = {styles.settingsButton}
          onPress = {() => navigation.navigate("Restaurant")}
        >
          <Text style = {styles.navButtonText}>
            Go to Restaurant
          </Text>
        </TouchableOpacity>

        <FormButton 
          buttonTitle='Logout'
          onPress={() => logout()}
        />
    </View>
  );
}

export default HomeScreen;

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
  },
  settingsButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
})