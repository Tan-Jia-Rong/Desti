import { useState, useEffect } from "react"
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import { AuthContext } from "../navigation/AuthProvider"
import { InputWrapper, InputField, AddImage, StatusWrapper, SubmitBtn, SubmitBtnText } from '../styles/AddReview';
import ActionButton from "react-native-action-button";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from "expo-image-picker";


const AddReviewScreen = ({navigation}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [review, setReview] = useState("");

  // Ask for permissions to user's camera and media gallery
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
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}>
      <InputWrapper>
        {image === null ? <AddImage source={{uri: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}} /> : <AddImage source={{uri: image}} />}
        <InputField 
          value ={review}
          onChangeText={setReview} 
          placeholder ="Write your review here"
          multiLine={true}
          numberOfLines={4}
          />
      </InputWrapper>
      <ActionButton buttonColor="#2e64e5">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take Photo"
          onPress={takePhotoFromCamera}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose Photo"
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </KeyboardAvoidingView>
  );
}

export default AddReviewScreen;

var width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  }
});

// Majority of the stylings for this screen
// is imported from '../styles/FeedStyles', where code there is written in CSS.