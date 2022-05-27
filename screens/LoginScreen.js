import React, {useState} from "react";
import { View, Image, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import logo from '../assets/Desti.png';
import { AuthTextInput, AuthPressable } from '../components';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    const restoreForm = () => {
        setEmailLogin('');
        setPasswordLogin('');
        Keyboard.dismiss();
    };

    const loginHandler = async () => {
        if(emailLogin.length == 0 || passwordLogin.length == 0) {
            alert("Missing fields! Please Try Again!")
            return;
        }

        await signInWithEmailAndPassword(auth, emailLogin, passwordLogin)
                .then(uc => {
                    const user = uc.user;
                    console.log(user);
                    restoreForm();
                }).catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if(errorCode == 'auth/wrong-password') {
                        alert('Wrong Password');
                    } else if (errorCode == 'auth/user-not-found') {
                        alert('User not found, have you already created an account?');
                    } else if ('auth/invalid-email') {
                        alert('Please enter a valid email');
                    }

                    console.error('[loginHandler]', errorCode, errorMessage);
                });
    };

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }} backgroundColor='blue'>

                <View style={styles.container}>
            
                    <Image source={ logo } style={styles.logo}/>

                    <AuthTextInput
                        value={emailLogin}
                        placeholder='Your Email'
                        textHandler={setEmailLogin}
                    />

                    <AuthTextInput
                        value={passwordLogin}
                        placeholder='Your Password'
                        textHandler={setPasswordLogin}
                        secureTextEntry
                    />

                    <AuthPressable
                        title="Log in"
                        onPressHandler={loginHandler}
                    />

                    <AuthPressable
                        title="Don't have an account? Sign Up!"
                        onPressHandler={() => navigation.navigate('SignUp')}
                    />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: 20,
      paddingTop: 50,
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
    },
});