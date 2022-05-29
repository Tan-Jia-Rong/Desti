import { useContext, useState } from "react"
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native"
import { FormButton, ReviewInput } from "../components"
import { AuthContext } from "../navigation/AuthProvider"


const AddReviewScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [review, setReview] = useState("");

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.inner}>

                <Image 
                    source={{uri: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}}
                    style={{height: 250, width: 250}}
                />

                <Text
                    style={styles.text}
                > Select your photo!</Text>

                <ReviewInput
                    value={review}
                    onChangeText={setReview}
                    placeHolderText = "Write your Review!"
                    autoCapitalize = "sentences"
                />
                
                <FormButton
                    buttonTitle={"Post"}
                    onPress={() => navigation.navigate("Home")}
                />
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
}

export default AddReviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
  inner: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#333333',
    paddingTop: 10,
    paddingBottom: 50
  }
})