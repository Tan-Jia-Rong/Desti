import React, { useContext, useState, useEffect } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { AuthContext } from "./AuthProvider"
import AuthStack from "./AuthStack"
import AppStack from "./AppStack"


const Routes = () => {
    // Set an initializing state whilst Firebase connects  
    const [initializing, setInitializing] = useState(true);
    const {user, setUser} = useContext(AuthContext);

    // Handle user state changes
    const AuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, AuthStateChanged);

        return subscriber; //unsubscribe on unmount
    }, []);

    // This null can be replaced with a splashScreen or Loader ie return <SplashScreen/>
    if (initializing) return null;

    return (
        <NavigationContainer>
            { user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default Routes;