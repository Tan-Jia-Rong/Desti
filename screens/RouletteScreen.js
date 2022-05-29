import { useContext, useState } from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"

const RouletteScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [value, setValue] = useState(0);

  return (
    <View style={styles.container}>
        <Image 
        style={{width: 400, height: 300}}
        source={{uri: "https://c.tenor.com/TsTxTJzoxgQAAAAC/chow-yun-fat-clap.gif"}}
        />

        <Text style={styles.text}>Roulette Screen</Text>

        <Text style={styles.text}>Score 50 to win!</Text>

        <Text style={styles.text}>you've rolled {value}</Text>
        <FormButton 
          buttonTitle='Roll'
          onPress={() => setValue(Math.floor((Math.random() * 100) + 1))}
        />
    </View>
  );
}

export default RouletteScreen;

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