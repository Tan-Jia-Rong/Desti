import React, { useContext, useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, TouchableWithoutFeedback, Keyboard, Alert, Image } from "react-native";
import { FormButton, FormInput } from "../components";
import { AuthContext } from "../navigation/AuthProvider";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from "expo-image-picker";


const EditProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
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
      setImage(result.uri);
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
      setImage(result.uri);
    };
  }

  const getUser = async () => {
    
  }

  const handleUpdate = () => {

  }

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
                {image === null ? 
                  <ImageBackground 
                    source={{uri: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}} 
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
              {user.displayName}
            </Text>
            <Text>{user.uid}</Text>
          </View>

          
          <FormInput
            placeHolderText = "Username"
            iconType = "user"
            autoCapitalize = "none"
            autocorrect = {false}
            />
          <FormInput
            placeHolderText = "Email"
            iconType = "mail"
            keyboardType = "email-address"
            autoCapitalize = "none"
            autocorrect = {false}
            />

          <FormButton
            buttonTitle="Update"
            onPress = {handleUpdate}
          />
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