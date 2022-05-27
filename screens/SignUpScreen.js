import React, {useState} from "react";
import { View, Image, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import logo from '../assets/Desti.png';
import { AuthTextInput, AuthPressable } from '../components';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const SignUpScreen = ({navigation}) => {
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [passwordRegConf, setPasswordRegConf] = useState('');

    const restoreForm = () => {
        setEmailReg('');
        setPasswordReg('');
        setPasswordRegConf('');
        Keyboard.dismiss();
    };

    const signUpHandler = async () => {
        if (emailReg.length == 0 || passwordReg.length == 0) {
            alert("Missing fields! Please Try Again!")
            return;
        } else if (passwordReg !== passwordRegConf) {
            alert("Your password does not match!")
            return;
        }

        await createUserWithEmailAndPassword(auth, emailReg, passwordReg)
            .then(uc => {
                const user = uc.user;

                console.log(user);

                alert("Sign Up Successful");
                restoreForm();

            }).catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode == 'auth/weak-password') {
                    alert('Your password is too weak!');
                } else if (errorCode == 'auth/email-already-in-use') {
                    alert('Email is already in use');
                } else if ('auth/invalid-email') {
                    alert('Please enter a valid email');
                }

                console.error('[signUpHandler]', errorCode, errorMessage);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
            <View style={styles.container}>
                <Image source={ logo } style={styles.logo}/>

                <AuthTextInput
                    value={emailReg}
                    placeholder='Email'
                    textHandler={setEmailReg}
                />

                <AuthTextInput
                    value={passwordReg}
                    placeholder='Password'
                    textHandler={setPasswordReg}
                    secureTextEntry
                />

                <AuthTextInput
                    value={passwordRegConf}
                    placeholder='Confirm Password'
                    textHandler={setPasswordRegConf}
                    secureTextEntry
                />

                <AuthPressable
                    title="Sign Up"
                    onPressHandler={signUpHandler}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: 20,
      paddingTop: 20
    },
    logo: {
        height: 300,
        width: 300,
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