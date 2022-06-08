import React, { createContext, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

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
                        const errorCode = error.code;
                        const errorMessage = error.message;

                        if(errorCode == 'auth/invalid-email') {
                            alert('Please enter a valid email');
                        } else if (errorCode == 'auth/user-not-found') {
                            alert('User not found, have you already created an account?');
                        } else if (errorCode == 'auth/wrong-password') {
                            alert('Wrong Password');
                        }

                        console.log(errorCode, errorMessage);
                    }
                },
                register: async (userName, email, password, passwordConf) => {
                    if (email.length == 0 || password.length == 0) {
                        alert("Missing fields! Please Try Again!")
                        return;
                    } else if (password !== passwordConf) {
                        alert("Your password does not match!")
                        return;
                    }

                    try {
                        await createUserWithEmailAndPassword(auth, email, password)
                          .then(() => updateProfile(auth.currentUser, {
                              displayName: userName
                          }))
                          .then(async () => {
                            await setDoc(doc(db, 'Users', auth.currentUser.uid), {
                                userName: userName,
                                email: email,
                                createdAt: Timestamp.fromDate(new Date()),
                                userImg: null,
                                userId: auth.currentUser.uid
                              });
                          });
                    } catch (error) {
                        const errorCode = error.code;
                        const errorMessage = error.message;

                        if(errorCode == 'auth/invalid-email') {
                            alert('Please enter a valid email');
                        } else if (errorCode == 'auth/email-already-in-use') {
                            alert('Email is already in use');
                        } else if (errorCode == 'auth/weak-password') {
                            alert('Your password is too weak!');
                        }
                        console.log(errorCode, errorMessage);
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