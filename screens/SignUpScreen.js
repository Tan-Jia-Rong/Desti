import React, {useState} from "react";
import { View, Image, StyleSheet, Keyboard } from 'react-native';
import logo from '../assets/Desti.png';
import { AuthTextInput, AuthPressable } from '../components';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const SignUpScreen = ({navigation}) => {
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');

    const restoreForm = () => {
        setEmailReg('');
        setPasswordReg('');
        Keyboard.dismiss();
    };

    const signUpHandler = () => {
        if(emailReg.length == 0 || passwordReg.length == 0) {
            alert("Missing fields! Please Try Again!")
            return;
        }

        createUserWithEmailAndPassword(auth, emailReg, passwordReg)
            .then(uc => {
                const user = uc.user;

                console.log(user);

                alert("Sign Up Successful");
                restoreForm();

            }).catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error('[signUpHandler]', errorCode, errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <Image source={ logo } style={styles.logo}/>

            <AuthTextInput
                value={emailReg}
                placeholder='Your Email'
                textHandler={setEmailReg}
            />

            <AuthTextInput
                value={passwordReg}
                placeholder='Your Password'
                textHandler={setPasswordReg}
                secureTextEntry
            />

            <AuthPressable
                title="Sign Up"
                onPressHandler={signUpHandler}
            />
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: 20,
      paddingTop: 50
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: 'cover',
    },
    welcomeText: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 20
    },
    authText: {
        fontSize: 20,
        marginBottom: 10
    }
});