import React, {useContext, useState} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import logo from '../assets/Desti.png';
import { FormInput, FormButton } from '../components';
import { AuthContext } from "../navigation/AuthProvider";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const {login} = useContext(AuthContext);

    return (
        <View style = {styles.container}>
            <Image source={ logo } style={styles.logo}/>

            <FormInput
                labelValue = {email}
                onChangeText = {setEmail}
                placeHolderText = "Email"
                iconType = "user"
                keyboardType = "email-address"
                autoCapitalize = "none"
                autocorrect = {false}
            />

            <FormInput
                labelValue = {password}
                onChangeText = {setPassword}
                placeHolderText = "Password"
                iconType = "lock"
                secureTextEntry = {true}
            />

            <FormButton
                buttonTitle="Sign in"
                onPress = {() => login(email, password)}
            />

            <TouchableOpacity
                style = {styles.signUpButton}
                onPress = {() => navigation.navigate("Signup")}
            >
                <Text style = {styles.navButtonText}>
                    Don't have an account? Create here
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50
    },
    logo: {
      height: 150,
      width: 150,
      resizeMode: 'cover',
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
    },
    navButton: {
      marginTop: 15,
    },
    signUpButton: {
      marginVertical: 35,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5',
    },
  });