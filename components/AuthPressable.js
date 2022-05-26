import { StyleSheet, Text, Pressable } from 'react-native';
import { windowHeight, windowWidth } from "../utils/dimensions";
import React from 'react';

const AuthPressable = (props) => {
    const { onPressHandler, title } = props;

    return (
        <Pressable
            style={styles.buttonContainer}
            onPress={onPressHandler}
            android_ripple={{ color: '#FFF' }}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
};

export default AuthPressable;

const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: 10,
      width: '100%',
      height: windowHeight / 15,
      backgroundColor: '#2e64e5',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
    },
  });