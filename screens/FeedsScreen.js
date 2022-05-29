import { useContext } from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { AuthContext } from "../navigation/AuthProvider"

const FeedsScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);

  return (
    <View style={styles.container}>
        <Text style={styles.text}>There's no feeds for now...</Text>
    </View>
  );
}

export default FeedsScreen;

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