import { useState, useEffect, useContext } from "react"
import { Text, View, StyleSheet, Image, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { AuthContext } from "../navigation/AuthProvider"
import { InputWrapper, InputField, AddImage, StatusWrapper, SubmitBtn, SubmitBtnText } from '../styles/AddReview';
import ActionButton from "react-native-action-button";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp, doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import StarRating from "react-native-star-rating-widget";
import { FormButton, TagButton } from "../components";



const AddReviewScreen = ({navigation, route}) => {
  // Available tags
  const tags = ["Asian","Beef", "Bars", "Burger", "Breakfast", "Buffet", "Cafes", "Chicken","Chinese", "Date Night", "Desserts", "Dim Sum",
                  "Drink", "Dinner", "Fine Dining", "French", "Fried", "Good For Groups", "Italian", "Indian", "Halal", "Hawker Food", "Healthy",
                  "Hot Pot", "Japanese", "Korean", "Korean BBQ", "Late Night", "LightBites","Malay", "Mexican", "Mookata", "Mutton", "Newly Opened",
                  "Pasta", "Pizza", "Pork", "Ramen", "Salad", "SeaFood", "Spanish", "Steak", "Supper", "Sushi", "Takeaway Option", "Thai", "Turkish",
                  "Vegetarian", "Western", "Zi Char"];
  const {user, logout} = useContext(AuthContext);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUpLoading] = useState(false);
  // Transferred bytes
  const [transferred, setTransferred] = useState(0);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  // Tags Selected
  const [selected, setSelected] = useState([]);
  console.log(selected);

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
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [], {compress: 800000/fileInfo.size});
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
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [], {compress: 800000/fileInfo.size});
        setImage(manipResult.uri)
      } else {
        setImage(result.uri);
      }
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

  // Upload to cloud firestore
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
      comments: null,
      rating: rating,
      restaurant: null,
      restaurantPlaceId: null
    });
    console.log("Document written with ID: ", docReference.id);
    setReview('');

    // Update restaurant collection
    if (route.params) {
      const restaurantRef = doc(db, 'Restaurants', route.params.restaurantResult.place_id);
      const restaurantSnap = await getDoc(restaurantRef);

      // Update the restaurant name in Posts collection
      await updateDoc(doc(db, 'Posts', docReference.id), {
        restaurant: route.params.restaurantResult.name,
        restaurantPlaceId: route.params.restaurantResult.place_id
      })

      // If the document already exists
      if (restaurantSnap.exists()) {
        const { averageRating, postsThatReviewed } = restaurantSnap.data();
        
        await updateDoc(restaurantRef, {
          averageRating: ((averageRating * postsThatReviewed.length) + rating)/(postsThatReviewed.length + 1)
        })

        await updateDoc(restaurantRef, {
          postsThatReviewed: arrayUnion(docReference.id)
        })

      // Else, we make the document  
      } else {
        // Not all restaurants provided by google has price_level, so we deal with it here
        if (typeof route.params.restaurantResult.price_level !== 'undefined') {
          const restaurantReference = await setDoc(restaurantRef, {
            name: route.params.restaurantResult.name,
            priceLevel: route.params.restaurantResult.price_level,
            averageRating: rating,
            postsThatReviewed: [docReference.id]
          })
        } else {
          const restaurantReference = await setDoc(restaurantRef, {
            name: route.params.restaurantResult.name,
            averageRating: rating,
            postsThatReviewed: [docReference.id]
          })
        }
      }
    }

    Alert.alert('Post uploaded to the Firebase Cloud Storage and firecloud database successfully');
    navigation.navigate('Home');
  }

  // OnPressHandler for Tags
  const onPressHandler = (tag) => {
    const result = addOrRemove(selected, tag);
    setSelected(result);
  }

  // Function to add or remove tags from selected array
  const addOrRemove = (array, item) => {
    console.log("addOrRemove procs")
    const exists = array.includes(item)
    if (exists) {
        console.log("If procs")
        return array.filter((c) => { return c !== item })
    } else {
        const result = array
        console.log("Else procs")
        result.push(item)
        // To ensure user only select 3 tags
        // Suggestion: To remove the limit but set limit when taking data
        if (result.length > 3) {
          alert("You can only select 3 tags MAX");
          return result.filter((c) => { return c !== item })
        }
        // Somehow color does not update when one just return result
        return result.filter(c => {return c});
    }
  }

  // Function to propogate tags
  const makeButtons = () => {
    console.log("button is made")
    return tags.map((tag, i) => {
      const on = selected.includes(tag)
      const backgroundColor = on ? "#7ee6ad" : "#ffffff"
      const textColor = on ? "#ffffff" : "#000000"
      const borderColor = on ? "#7ee6ad" : "#000000"
      return (
        <TagButton
          backgroundColor={backgroundColor}
          textColor={textColor}
          borderColor={borderColor}
          onPressHandler={() => {onPressHandler(tag)}}
          key={i}
          tagName={tag} />
      )
    })
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
            <View style={{flex: 1, justifyContent: 'center'}}>
            <StarRating
              rating={rating}
              onChange={setRating}
              />
            </View>
            {route.params ? 
             <FormButton
             buttonTitle={route.params.restaurantResult.name}
             onPress={() => navigation.navigate("Get Restaurant")}
             />
            :
            <FormButton
              buttonTitle={"Add restaurant"}
              onPress={() => navigation.navigate("Get Restaurant")}
              />
            }
            <View style={{height:300}}>
              <Text style={styles.reviewTextStyle}> Please select 3 tags that best describe the restaurant!</Text>
              <ScrollView nestedScrollEnabled={true}>
                <View style={styles.tagContainer}>
                {makeButtons()}
                </View>
              </ScrollView>
            </View>
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
  tagContainer: {
    height:"30%",
    width:"100%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  reviewTextStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16
  }
});

// Majority of the stylings for this screen
// is imported from '../styles/FeedStyles', where code there is written in CSS.