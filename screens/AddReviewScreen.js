import { useState, useEffect, useContext } from "react"
import { Text, View, StyleSheet, Image, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { AuthContext } from "../navigation/AuthProvider"
import { InputWrapper, InputField, AddImage, StatusWrapper, SubmitBtn, SubmitBtnText } from '../styles/AddReview';
import ActionButton from "react-native-action-button";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from "expo-image-picker";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";



const AddReviewScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUpLoading] = useState(false);
  // Transferred bytes
  const [transferred, setTransferred] = useState(0);
  const [review, setReview] = useState("");

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

  // Whenever user submits a post, uploads image to firebase cloud storage and returns download URL
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

  // Upload to firecloud database
  const submitPost = async () => {
    // If no image has been uploaded
    if (image === null) {
      Alert.alert("You have not submitted any photo");
      return null;
    }
    const imageUrl = await uploadImage();
    console.log("Image url is: " + imageUrl)

  
    const docReference = await addDoc(collection(db, 'Posts'), {
      userId: user.uid,
      postText: review,
      postImg: imageUrl,
      postTime: Timestamp.fromDate(new Date()),
      likes: null,
      comments: null
    });
    console.log("Document written with ID: ", docReference.id);
    setReview('');
    Alert.alert('Image uploaded to the Firebase Cloud Storage and firecloud database successfully');
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
    <KeyboardAvoidingView style={{flex:1, backgroundColor: '#2e64e515'}}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <InputWrapper>
            {image === null ? <AddImage source={{uri: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}} /> : <AddImage source={{uri: image}} />}
              <InputField 
                value ={review}
                onChangeText={setReview} 
                placeholder ="Write your review here"
                multiline={true}
                numberOfLines={4}
              />
            {uploading ? (
              <StatusWrapper>
                <Text>{transferred}% Completed</Text>
                <ActivityIndicator size='large' color='#0000ff' />
              </StatusWrapper>
            ) : (
              <SubmitBtn onPress={submitPost}>
                <SubmitBtnText>Post</SubmitBtnText>
              </SubmitBtn>
            )}
          </InputWrapper>
        </TouchableWithoutFeedback>
      </ScrollView>

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