import { useState, useEffect, useContext } from "react"
import { Text, View, StyleSheet, Image, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ImageBackground } from "react-native";
import { AuthContext } from "../navigation/AuthProvider"
import { InputWrapper, InputField, AddImage, StatusWrapper, SubmitBtn, SubmitBtnText } from '../styles/AddReview';
import ActionButton from "react-native-action-button";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp, doc, setDoc, updateDoc, getDoc, arrayUnion, increment } from "firebase/firestore";
import StarRating from "react-native-star-rating-widget";
import { FormButton, TagButton } from "../components";



const AddReviewOtherScreen = ({navigation, route}) => {
  // Available tags: displayed in line 323
  const tags = ["Asian","Bars", "Beef", "Breakfast", "Buffet", "Burger", "Cafes", "Chicken", "Chinese", "Desserts", 
                  , "Dinner", "Drink", "French", "Fried", "Indian", "Italian",  "Halal", "Healthy",
                  "HotPot", "Japanese", "Korean", "LightBites","Malay", "Mexican", "Mookata", "Mutton",
                  "Pasta", "Pizza", "Pork", "Ramen", "Salad", "SeaFood", "Spanish", "Steak", "Supper", "Sushi", "Takeaway", "Thai", "Turkish",
                  "Vegetarian", "Western"];
  const {user, logout} = useContext(AuthContext);
  const { result } = route.params;

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
  const [tagName, setTagName] = useState('');
  const windowWidth = Dimensions.get('window').width;

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
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [], {compress: 0});
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
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [], {compress: 0});
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
      likes: [],
      comments: null,
      rating: rating,
      restaurant: null,
      restaurantPlaceId: null
    });
    console.log("Document written with ID: ", docReference.id);
    setReview('');

    // Update userPreferences collection
    const userPrefRef = doc(db, 'userPreferences', user.uid);
    selected.forEach(async item => {
        await updateDoc(userPrefRef, {
          [item]: increment(1)
        })
      })

    // Update restaurant and restaurantTags collection
    if (result) {
      const restaurantRef = doc(db, 'Restaurants', result.place_id);
      const restaurantSnap = await getDoc(restaurantRef);

      const restaurantTagsRef = doc(db, 'RestaurantTags', result.place_id);
      const restaurantTagsSnap = await getDoc(restaurantTagsRef);

      // Update the restaurant name in Posts collection
      await updateDoc(doc(db, 'Posts', docReference.id), {
        restaurant: result.name,
        restaurantPlaceId: result.place_id,
      })

      // If the restaurant document already exists 
      if (restaurantSnap.exists() && restaurantTagsSnap.exists()) {
        const { averageRating, postsThatReviewed } = restaurantSnap.data();
        
        // update Restaurants collection
        await updateDoc(restaurantRef, {
          averageRating: averageRating === null ? (rating)/(postsThatReviewed.length + 1)
                                                     : ((averageRating * postsThatReviewed.length) + rating)/(postsThatReviewed.length + 1)
        })

        // update Restaurants collection
        await updateDoc(restaurantRef, {
          postsThatReviewed: arrayUnion(docReference.id)
        })

       // update RestaurantTags collection
       selected.forEach(async item => {
        await updateDoc(restaurantTagsRef, {
          [item]: increment(1)
        })
       })

      // Else, we make the document  
      } else {
        // Not all restaurants provided by google has price_level, so we deal with it here
        if (typeof result.price_level !== 'undefined') {
          // Set Restaurants collection
          const restaurantReference = await setDoc(restaurantRef, {
            name: result.name,
            priceLevel: result.price_level,
            averageRating: rating,
            postsThatReviewed: [docReference.id]
          })

          // Set RestaurantTags collection
          await setDoc(restaurantTagsRef, {
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

          // update RestaurantTags collection
          selected.forEach(async item => {
            await updateDoc(restaurantTagsRef, {
              [item]: increment(1)
            })
           })
        } else {
          // Set Restaurants collection
          const restaurantReference = await setDoc(restaurantRef, {
            name: result.name,
            averageRating: rating,
            postsThatReviewed: [docReference.id],
            priceLevel: -1
          })

          // Set RestaurantTags collection
          await setDoc(restaurantTagsRef, {
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

          // update RestaurantTags collection
          selected.forEach(async item => {
            await updateDoc(restaurantTagsRef, {
              [item]: increment(1)
            })
           })
        }
      }
    }

    Alert.alert('Post uploaded to the Firebase Cloud Storage and firecloud database successfully');
    navigation.navigate('RestaurantScreen', {result});
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

  // if (hasCameraPermission === false && hasGalleryPermission === false) {
  //   return <Text>No permission access to camera and photo gallery</Text>
  // }

  // if (hasCameraPermission === false ) {
  //   return <Text>No permission access to camera</Text>
  // }

  // if (hasGalleryPermission === false) {
  //   return <Text>No permission access to photo gallery</Text>
  // }

  return (
    <KeyboardAvoidingView style={{flex:1, backgroundColor: '#2e64e515'}} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <InputWrapper>
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
                {image === null ? 
                  <ImageBackground 
                  source={{uri: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}} 
                  style={{ 
                    width: windowWidth,
                    height: 250,
                    marginBottom: 15}}
                  >
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
                  <Image 
                    source={{uri: image}} 
                    style={{ 
                      width: windowWidth,
                      height: 250,
                      marginBottom: 15}}/>
                }
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent: 'center'}}>
            <StarRating
              rating={rating}
              onChange={setRating}
              />
            </View>       
              <InputField 
                value ={review}
                onChangeText={setReview} 
                placeholder ="Write your review here"
                multiline={true}
                numberOfLines={4}
              />
                <View style={{height:300}}>
              <Text style={styles.reviewTextStyle}> Please select 3 tags that best describe the restaurant!</Text>
              <ScrollView nestedScrollEnabled={true}>
                <View style={styles.tagContainer}>
                {makeButtons()}
                </View>
              </ScrollView>
            </View>
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
    </KeyboardAvoidingView>
  );
}

export default AddReviewOtherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagContainer: {
    height:"30%",
    width: "100%",
    flexDirection: 'row',
    flexWrap: 'wrap'
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