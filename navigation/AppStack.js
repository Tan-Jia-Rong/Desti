import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from 'react-native';
import { HomeScreen, MapScreen, RestaurantScreen, SettingsScreen, RouletteScreen } from "../screens";

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
            />

            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{header: () => null}}
            />

            <Stack.Screen
                name="Restaurant"
                component={RestaurantScreen}
                options={{header: () => null}}
            />

            <Stack.Screen
                name="Map"
                component={MapScreen}
                options={{header: () => null}}
            />

            <Stack.Screen
                name="Roulette"
                component={RouletteScreen}
                options={{header: () => null}}
            />
        </Stack.Navigator>
    )
}

export default AppStack