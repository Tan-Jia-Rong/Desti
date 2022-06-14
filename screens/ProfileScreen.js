import React, {useCallback, useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity, Alert} from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import { collection, getDocs, query, orderBy, where, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { ref, deleteObject } from "firebase/storage";
import { storage, db } from "../firebase";
import PostCard from "../components/PostCard";


const ProfileScreen = ({ navigation, route }) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const fetchPosts = async () => {
    try {
      const arr = [];
      const q = query(collection(db, 'Posts'), where('userId', "==", route.params ? route.params.userId : user.uid), orderBy("postTime", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const {userId, postText, postImg, postTime, likes, comments} = doc.data();
        // For each doc in the firecloud database, push it into the array
        arr.push({
          id: doc.id,  
          userId,
          userName: 'Placeholder',
          userImg: require('../assets/this_is_fine.jpg'),
          postTime: postTime,
          postText: postText,
          postImg: postImg,
          liked: false,
          likes,
          comments
        });
      }, []);
      
      setPosts(arr);
      console.log("useEffect triggered");

    } catch(e) {
      console.log(e);
    }
  }

  // Get the user data from firecloud
  const getUser = async () => {
    const docRef = doc(db, "Users", route.params ? route.params.userId : user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {  
      setUserData(docSnap.data());
    }
  }

    // useFocusEffect ensures that my home screen refreshes each time I visit home screen
    useFocusEffect(React.useCallback(() => {
      getUser();
      fetchPosts();
    }, []));

    // Re-renders screen when a post has been deleted
    useEffect(() => {
      getUser();
      fetchPosts();
    },[deleted]);

    const handleDelete = (postId) => {
      Alert.alert(
        "Confirm Deletion of post",
        "Are you sure?",  
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { 
            text: "Yes", 
            onPress: () => deletePost(postId) }
        ],
        { cancelable: false }
      );
    }

    // Deletes a post on both firebase storage and firestore cloud, as well as refreshes the feed
  const deletePost = async (postId) => {
    setDeleted(false);
    console.log("Current Post Id: ", postId);

    // First, delete the image from firebase storage
    const docRef = doc(db, 'Posts', postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {postImg} = docSnap.data();
      const imageRef = ref(storage, postImg);

      deleteObject(imageRef)
      .then(async () => {
        console.log("Successful deletion");
        // Second, delete data from firestore cloud
        await deleteDoc(doc(db, 'Posts', postId));
        Alert.alert("Post has been successfully deleted");
        setDeleted(true);
      })
      .catch((e) => {
        console.log(e);
      });
    }
  }

  return (
   <SafeAreaView style = {{flex: 1, backgroundColor: '#fff'}}>
     <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
    >
      {userData ? 
       <Image
       style={styles.userImg}
       source={{uri: userData.userImg}} 
      />
      : 
      <Image
       style={styles.userImg}
       source={{uri: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}} 
      />
      }
      <Text style = {styles.userName}>{userData ? userData.userName : 'Placeholder username'}</Text>
      {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
      <Text style = {styles.aboutUser}>Placeholder user information</Text>

      <View style={styles.userBtnWrapper}>
        {route.params ? (
          route.params.userId === user.uid ? 
          <>
            <TouchableOpacity style = {styles.userBtn} onPress={() => navigation.navigate('Edit Profile')}>
              <Text style = {styles.userBtnTxt}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.userBtn} onPress={() => logout()}>
              <Text style = {styles.userBtnTxt}>Logout</Text>
            </TouchableOpacity>
          </> :
          <>
           <TouchableOpacity style = {styles.userBtn} onPress={() => {}}>
              <Text style = {styles.userBtnTxt}>Follow</Text>
            </TouchableOpacity>
          </>

        ) : (
          <>
            <TouchableOpacity style = {styles.userBtn} onPress={() => navigation.navigate('Edit Profile')}>
              <Text style = {styles.userBtnTxt}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.userBtn} onPress={() => logout()}>
              <Text style = {styles.userBtnTxt}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style = {styles.userInfoWrapper}>
        <View style = {styles.userInfoItem}>
          <Text style = {styles.userInfoTitle}>{posts.length}</Text>
          <Text style={styles.userInfoSubtitle}>{posts.length === 0 || posts.length === 1 ? 'Post' : 'Posts'}</Text>
        </View>
        <View style = {styles.userInfoItem}>
          <Text style = {styles.userInfoTitle}>100</Text>
          <Text style={styles.userInfoSubtitle}>Followers</Text>
        </View>
        <View style = {styles.userInfoItem}>
          <Text style = {styles.userInfoTitle}>88</Text>
          <Text style={styles.userInfoSubtitle}>Following</Text>
        </View>
      </View>

      {posts.map((item) => (
        <PostCard key={item.id} item={item} onDelete={handleDelete} />
      ))}
     </ScrollView>
   </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})