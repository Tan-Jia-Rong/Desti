import React, { useContext, useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, TouchableWithoutFeedback, Keyboard, Alert, Image, ActivityIndicator } from "react-native";
import { FormButton, FormInput } from "../components";
import { AuthContext } from "../navigation/AuthProvider";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useFocusEffect } from "@react-navigation/native";


const EditProfileScreen = ({ navigation }) => {
  const {user, logout} = useContext(AuthContext);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUpLoading] = useState(false);
  // Transferred bytes
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);

  // Ask for permissions to access user's camera and media gallery
  useEffect(() => {
    (async () => {
      const camerastatus = await ImagePicker.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(camerastatus.status === 'granted');
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const getFileInfo = async (fileURI) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI);
    return fileInfo;
  }

  const isLessThan800KB = (fileSize) => {
    const isOk = fileSize / 1024/ 1024 < 0.8
    return isOk;
  }

  // Function for taking photo from camera
  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    // If result is not cancelled
    if (!result.cancelled) {
      const fileInfo = await getFileInfo(result.uri);

      if (!isLessThan800KB(fileInfo.size)) {
        console.log(fileInfo.size);
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [], {compress: 100000/fileInfo.size});
        setImage(manipResult.uri)
      } else {
        setImage(result.uri);
      }
    };
  }

  // Function for choosing photo from media library
  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    // If result is not cancelled
    if (!result.cancelled) {
      const fileInfo = await getFileInfo(result.uri);

      if (!isLessThan800KB(fileInfo.size)) {
        console.log(fileInfo.size);
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [], {compress: 100000/fileInfo.size});
        setImage(manipResult.uri)
      } else {
        setImage(result.uri);
      }
    };
  }

  // Whenever user submits a new profile picture, uploads image to firebase cloud storage and returns download URL
  const uploadImage = async () => {
    // If no photo has been uplodaded yet
    if (image === null) {
      return null;
    }
    const uploadUri = image;
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
      const uploadTask = uploadBytesResumable(reference, bytes);
     
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100);

          setTransferred(Math.round(progress));
        }
      );

      // Get the downloaded URL
      const url = await uploadTask.then(() => {
        return getDownloadURL(reference)
          .then((downloadedUrl) => {
            return downloadedUrl;
          })
      })

      // After post has been uploaded to the Firebase Cloud Storage and we have gotten the URL
      setUpLoading(false);
      setImage(null);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // Get the user data from firecloud
  const getUser = async () => {
    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  }

  // Update the user data in firecloud
  const handleUpdate = async () => {
    let imageUrl = await uploadImage(); 

    // If user only wants to update text input fields and not his/her profile pic
    if (imageUrl === null && userData.userImg !== null) {
      imageUrl = userData.userImg;
    }
    
    // Update the data in firecloud
    const userRef = doc(db, 'Users', user.uid);
    await updateDoc(userRef, {
      userName: userData.userName,
      email: userData.email,
      userImg: imageUrl
    }).then(() => {
      console.log('User updated!');
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully'
      )
      navigation.navigate("Profile");
    });
  }

  useFocusEffect(React.useCallback(() => {
    getUser();
  }, []));

  if (hasCameraPermission === false && hasGalleryPermission === false) {
    return <Text>No permission access to camera and photo gallery</Text>
  }

  if (hasCameraPermission === false ) {
    return <Text>No permission access to camera</Text>
  }

  if (hasGalleryPermission === false) {
    return <Text>No permission access to photo gallery</Text>
  }

  return (
    <View style = {styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{margin: 20}}>
          <View style = {{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => Alert.alert(
              "Method of Upload",
              "Choose one", 
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Take Photo",
                  onPress: takePhotoFromCamera
                },
                { 
                  text: "Choose Photo", 
                  onPress: choosePhotoFromLibrary
                }
              ],
              { cancelable: false }
            )}>
              <View style={{
                height:100,
                width:100,
                borderRadius:15,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {image === null && userData ? 
                  <ImageBackground 
                  source={{uri: userData.userImg}} 
                  style={{height: 100, width: 100}}
                  imageStyle={{borderRadius: 15}}>
                  <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                  <Icon 
                    name="camera" 
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10
                    }}/>
                  </View>
              </ImageBackground>: 
                  <ImageBackground 
                  source={{uri: image}} 
                  style={{height: 100, width: 100}}
                  imageStyle={{borderRadius: 15}}>
                  <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Icon 
                      name="camera" 
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10
                      }}/>
                  </View>
                </ImageBackground>}
              </View>
            </TouchableOpacity>
            <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
              {userData ? userData.userName : 'Placeholder username'}
            </Text>
            <Text>Unique ID: {user.uid}</Text>
          </View>

          
          <FormInput
            value={userData ? userData.userName : 'Username'}
            onChangeText={(text) => setUserData({...userData, userName: text})}
            placeHolderText = "Username"
            iconType = "user"
            autoCapitalize = "none"
            autocorrect = {false}
            />
          <FormInput
            value={userData ? userData.email : 'Email'}
            onChangeText={(text) => setUserData({...userData, email: text})}
            placeHolderText = "Email"
            iconType = "mail"
            keyboardType = "email-address"
            autoCapitalize = "none"
            autocorrect = {false}
            />
            {uploading ? (
              <View style={{justifyContent:'center', alignItems:'center'}}>
                <Text>{transferred}% Completed</Text>
                <ActivityIndicator size='large' color='#0000ff' />
              </View>
            ) : (
              <FormButton
                buttonTitle="Update"
                onPress = {handleUpdate}
              />
            )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}


export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#00008B',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: -4,
    paddingLeft: 10,
    color: '#05375a',
  }
});