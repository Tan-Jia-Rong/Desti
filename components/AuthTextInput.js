import { View, StyleSheet, TextInput } from 'react-native';
import { windowHeight, windowWidth } from "../utils/dimensions";
import React from 'react';

const THEME = '#3F3F3F';

const AuthTextInput = (props) => {
    const { secureTextEntry, placeholder, value, textHandler } = props;

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                value={value}
                onChangeText={textHandler}
                selectionColor={THEME}
            />
        </View>
    );
};

export default AuthTextInput;

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 5,
        marginBottom: 10,
        width: '100%',
        height: windowHeight / 15,
        borderColor: '#ccc',
        borderRadius: 3,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
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
  });