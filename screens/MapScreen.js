import { useContext } from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const MapScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);

  return (
    <View style={styles.container}>
        <Image 
        style={{width: 400, height: 300}}
        source={{uri: "https://media2.giphy.com/media/B14Ym7cs4PxwRUdCtN/200.gif"}}
        />

        <Text style={styles.text}>There's no map for now...</Text>
        <FormButton 
          buttonTitle='Go Back'
          onPress={() => navigation.navigate("Home")}
        />
    </View>
  );
}

export default MapScreen;

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