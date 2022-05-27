import React, {useState, useContext } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FormButton, FormInput } from '../components';
import { AuthContext } from "../navigation/AuthProvider";

const SignUpScreen = ({navigation}) => {
    const [emailReg, setEmailReg] = useState();
    const [passwordReg, setPasswordReg] = useState();
    const [passwordRegConf, setPasswordRegConf] = useState();

    const {register} = useContext(AuthContext);

    return (
        <View style = {styles.container}>
            <Text style = {styles.text}>Create an account</Text>

            <FormInput
                labelValue = {emailReg}
                onChangeText = {setEmailReg}
                placeHolderText = "Email"
                iconType = "user"
                keyboardType = "email-address"
                autoCapitalize = "none"
                autocorrect = {false}
            />

            <FormInput
                labelValue = {passwordReg}
                onChangeText = {setPasswordReg}
                placeHolderText = "Password"
                iconType = "lock"
                secureTextEntry = {true}
            />

            <FormInput
                labelValue = {passwordRegConf}
                onChangeText = {setPasswordRegConf}
                placeHolderText = "Confirm Password"
                iconType = "lock"
                secureTextEntry = {true}
            />

            <FormButton
                buttonTitle = "Sign up"
                onPress = {() => register(emailReg, passwordReg)}
            />
        </View>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f9fafd',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
    },
    navButton: {
      marginTop: 15,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5',
    },
    textPrivate: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 35,
      justifyContent: 'center',
    },
    color_textPrivate: {
      fontSize: 13,
      fontWeight: '400',
      color: 'grey',
    },
});