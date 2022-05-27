import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from 'react-native';
import { HomeScreen } from "../screens";

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
            />
        </Stack.Navigator>
    )
}

export default AppStack