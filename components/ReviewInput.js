import { TextInput, View, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { windowHeight, windowWidth } from "../utils/dimensions";


const FormInput = ({labelValue, placeHolderText, ... rest}) => {
    return (
        <View style = {styles.inputContainer}>
            <TextInput
                style = {styles.input}
                value = {labelValue}
                placeholder = {placeHolderText}
                multiline= {true}
                placeholderTextColor = "#666"
                {... rest}
            />
        </View>
    );
}

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 10,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },

  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});