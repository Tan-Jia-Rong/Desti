import { useContext } from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const RestaurantScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);

  return (
    <View style={styles.container}>
        <Text style={styles.text}>This is the Restaurant Page</Text>
        <Image 
        style={{width: 300, height: 300}}
        source={{uri: "https://www.meme-arsenal.com/memes/bcf086f200fdab25abd43134ae1ee491.jpg"}}
        />

        <FormButton 
          buttonTitle='Go Back'
          onPress={() => navigation.navigate("Home")}
        />
    </View>
  );
}

export default RestaurantScreen;

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