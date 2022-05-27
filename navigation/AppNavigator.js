import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { LoginScreen, SignUpScreen, HomeScreen } from "../screens";
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";


const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const AppNavigator = () => {

    // Set an initializing state whilst Firebase connect
    const [isAuth, setIsAuth] = useState(false);

    const logoutHandler = () => {
        signOut(auth).then(() => {
            setIsAuth(false);
            alert('You have signed out!')
        });
    };

    const LogoutIcon = () => (
        <TouchableOpacity onPress={logoutHandler}>
            <MaterialIcons name="logout" size={28} color="#407BFF" />
        </TouchableOpacity>
    );

    useEffect(() => {
        // Mounting function
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            (authenticatedUser) => {
                if (authenticatedUser) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            });

        // Clean up mechanism
        // React performs clean up when component unmounts. In our case,
        // app stops running.
        return () => unsubscribeAuthStateChanged();
    }, []);

    const MainNavigator = () => (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Desti' }}
            />

            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
            />
        </Stack.Navigator>
    );

    const HomeNavigator = () => (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerRight: () => <LogoutIcon />,
                }}
            />
        </HomeStack.Navigator>
    );

    return ( 
        <NavigationContainer>
            {isAuth ? <HomeNavigator /> : <MainNavigator />}
        </NavigationContainer>
    );
}

export default AppNavigator;