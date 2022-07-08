import React, { createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { toBeExportedImageUrl } from "../screens/SignUpScreen";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [uploading, setUpLoading] = useState(false);
    // Transferred bytes
    const [transferred, setTransferred] = useState(0);
    const [image, setImage] = useState('https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png');

    // Whenever user submits a post, uploads image to firebase cloud storage and returns download URL
  const uploadImage = async () => {
    // If no photo has been uplodaded yet
    if (toBeExportedImageUrl === null) {
      return null;
    }
    const uploadUri = toBeExportedImageUrl;
    // Get the last part of the string
    let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to fileName to give unique fileNames, ie string manipulation
    // Split method splits a string into an array of substrings, then pop it
    const extension = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extension;
    
    setUpLoading(true);
    setTransferred(0);

    try {
      // A reference is a local pointer to some file on your bucket. This
      // can either be a file which already exists, or one which does not exist yet.
      const reference = ref(storage, 'photos/' + fileName);

      // Convert image into array of bytes
      const img = await fetch(uploadUri);
      const bytes = await img.blob();

      // Upload the image to firebase cloud storage, and then get the url
      const url = uploadBytes(reference, bytes).then(() => {
        return getDownloadURL(reference)
          .then((downloadedUrl) => {
            return downloadedUrl;
          })
      });

      // After post has been uploaded to the Firebase Cloud Storage and we have gotten the URL
      setUpLoading(false);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
 
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
                    if (userName.length == 0 || email.length == 0 || password.length == 0) {
                        alert("Missing fields! Please Try Again!")
                        return;
                    } else if (password !== passwordConf) {
                        alert("Your password does not match!")
                        return;
                    }

                    try {
                        await createUserWithEmailAndPassword(auth, email, password)
                          .then(async () => {
                            await setDoc(doc(db, 'Users', auth.currentUser.uid), {
                                userName: userName,
                                email: email,
                                createdAt: Timestamp.fromDate(new Date()),
                                userId: auth.currentUser.uid,
                                userImg: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png',
                                following: 0,
                                followers: 0
                              });
                          })
                          .then(async () => {
                            const imageUrl = await uploadImage();
                            console.log("imageURL is: ", imageUrl);
                            if (imageUrl !== null) {
                                await updateDoc(doc(db, 'Users', auth.currentUser.uid), {
                                    userImg: imageUrl
                                     })
                            }
                          })
                          .then(async () => {
                            await setDoc(doc(db, 'Following', auth.currentUser.uid), {
                                usersFollowing: [],
                                followers: []
                            })
                          })
                          .then(async () => { 
                            await setDoc(doc(db, 'userPreferences', auth.currentUser.uid), { 
                              Asian: 0, 
                              Beef: 0, 
                              Bars: 0, 
                              Burger: 0, 
                              Breakfast: 0, 
                              Buffet: 0, 
                              Cafes: 0, 
                              Chicken: 0, 
                              Chinese: 0,  
                              Desserts: 0, 
                              Drink: 0, 
                              Dinner: 0, 
                              French: 0, 
                              Fried: 0, 
                              Italian: 0, 
                              Indian: 0, 
                              Halal: 0, 
                              Healthy: 0, 
                              HotPot: 0,
                              Japanese: 0,
                              Korean: 0,
                              LightBites: 0,
                              Malay: 0,
                              Mexican: 0,
                              Mookata: 0,
                              Mutton: 0,
                              Pasta: 0,
                              Pizza: 0,
                              Pork: 0,
                              Ramen: 0,
                              Salad: 0,
                              SeaFood: 0,
                              Spanish: 0,
                              Steak: 0,
                              Supper: 0,
                              Sushi: 0,
                              Takeaway: 0,
                              Thai: 0,
                              Turkish: 0,
                              Vegetarian: 0,
                              Western: 0,
                            })
                          })
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