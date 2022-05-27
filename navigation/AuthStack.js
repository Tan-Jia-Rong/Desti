import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from 'react-native';
import { LoginScreen, SignUpScreen } from "../screens";
import Icon from "react-native-vector-icons/FontAwesome"

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{header: () => null}}
            />

            <Stack.Screen
                name="Signup"
                component={SignUpScreen}
                options={({navigation}) => ({
                    title: "",
                    headerStyle: {
                        backgroundColor: "#f9fafd",
                        shadowColor: '#f9fafd',
                        elevation: 0
                    },
                    headerLeft: () => {
                        <View style = {{marginLeft: 10}}>
                            <Icon.Button
                                name = 'long-arrow-left'
                                size = {25}
                                backgroundColor = '#f9fafd'
                                color = '#333'
                                onPress={() => navigation.navigate('Login')}
                            />
                        </View>
                    }
                })}
            />
        </Stack.Navigator>
    );
}

export default AuthStack;