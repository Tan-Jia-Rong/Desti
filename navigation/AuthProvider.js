import React, { createContext, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await signInWithEmailAndPassword(auth, email, password);
                    } catch (error) {
                        console.log(error);
                    }
                },
                register: async (email, password) => {
                    try {
                        await createUserWithEmailAndPassword(auth, email, password);
                    } catch (error) {
                        console.log(error);
                    }
                },
                logout: async () => {
                    try {
                        await signOut(auth);
                    } catch (error) {
                        console.log(error);
                    }
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}