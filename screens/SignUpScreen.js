import React, {useState, useContext, useEffect } from "react";
import { View, Text, Keyboard, TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { FormButton, FormInput } from '../components';
import { AuthContext } from "../navigation/AuthProvider";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from "expo-image-picker";


const SignUpScreen = ({navigation}) => {
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConf, setPasswordConf] = useState();

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);

    const {register} = useContext(AuthContext);

    const restoreForm = () => {
      setUserName();
      setEmail();
      setPassword();
      setPasswordConf();
      Keyboard.dismiss();
    };

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
      <ScrollView>
      <KeyboardAvoidingView
       behavior={Platform.OS === "ios" ? "padding" : "height"}
       style={styles.container}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          
        <View style = {styles.inner}>
              <Text style = {styles.text}>Create an account</Text>

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
          </View>
        </View>

              <FormInput
                  labelValue = {userName}
                  onChangeText = {setUserName}
                  placeHolderText = "Username"
                  iconType = "user"
                  autocorrect = {false}
              />

              <FormInput
                  labelValue = {email}
                  onChangeText = {setEmail}
                  placeHolderText = "Email"
                  iconType = "mail"
                  keyboardType = "email-address"
                  autoCapitalize = "none"
                  autocorrect = {false}
              />

              <FormInput
                  labelValue = {password}
                  onChangeText = {setPassword}
                  placeHolderText = "Password"
                  iconType = "lock"
                  secureTextEntry = {true}
                  autoCapitalize = "none"
                  autocorrect = {false}
              />

              <FormInput
                  labelValue = {passwordConf}
                  onChangeText = {setPasswordConf}
                  placeHolderText = "Confirm Password"
                  iconType = "lock"
                  secureTextEntry = {true}
                  autoCapitalize = "none"
                  autocorrect = {false}
              />

              <FormButton
                  buttonTitle = "Sign up"
                  onPress = {() => register(userName, email, password, passwordConf) && restoreForm()}
              />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </ScrollView>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
    },
    navButton: {
      marginTop: 15,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5',
    },
    textPrivate: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 35,
      justifyContent: 'center',
    },
    color_textPrivate: {
      fontSize: 13,
      fontWeight: '400',
      color: 'grey',
    },
});