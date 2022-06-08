import React, {useCallback, useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity} from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { ref, deleteObject } from "firebase/storage";
import { db } from "../firebase";
import PostCard from "../components/PostCard";

const ProfileScreen = ({ navigation, route }) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const arr = [];
      const q = query(collection(db, 'Posts'), where('userId', "==", user.uid), orderBy("postTime", "desc"));
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

    // useFocusEffect ensures that my home screen refreshes each time I visit home screen
    useFocusEffect(React.useCallback(() => {
      fetchPosts();
    }, []));

    const handleDelete = () => {}

  return (
   <SafeAreaView style = {{flex: 1, backgroundColor: '#fff'}}>
     <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
    >
      <Image
       style={styles.userImg}
       source={require('../assets/mike.png')}
      />
      <Text style = {styles.userName}>{user.displayName}</Text>
      <Text>{route.params ? route.params.userId : user.uid}</Text>
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
          <Text style = {styles.userInfoTitle}>22</Text>
          <Text style={styles.userInfoSubtitle}>Posts</Text>
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