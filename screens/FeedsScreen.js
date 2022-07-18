import React, {useCallback, useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Image, FlatList, Alert, ScrollView } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import PostCard from '../components/PostCard';
import { storage, db } from "../firebase";
import { collection, getDocs, query, orderBy, doc, getDoc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useFocusEffect } from "@react-navigation/native";


import { Container } from "../styles/FeedStyles";

const FeedsScreen = ({ navigation }) => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [deleted, setDeleted] = useState(false);

  const fetchPosts = async () => {
    try {
      const arr = [];
      const q = query(collection(db, 'Posts'), orderBy("postTime", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const {userId, postText, postImg, postTime, likes, comments, rating, restaurant, restaurantPlaceId} = doc.data();
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
          comments,
          rating,
          restaurant,
          restaurantPlaceId
        });
      }, []);
      
      setPosts(arr);
      console.log("useEffect triggered");

    } catch(e) {
      console.log(e);
    }
  }

  // Deletes a post on three things, firstly firebase storage, secondly Posts collection firestore cloud, thirdly Restaurants collection firestore cloud, as well as refreshes the feed
  const deletePost = async (postId) => {
    setDeleted(true);
    console.log("Current Post Id: ", postId);

    // First, delete the image from firebase storage
    const docRef = doc(db, 'Posts', postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {postImg, restaurantPlaceId, rating} = docSnap.data();
      const imageRef = ref(storage, postImg);

      deleteObject(imageRef)
      .then(async () => {
        console.log("Successful deletion");
        // Second, delete data from firestore cloud
        await deleteDoc(doc(db, 'Posts', postId));
        setDeleted(false);
        Alert.alert("Post has been successfully deleted");
      })
      .catch((e) => {
        console.log(e);
      });

      // Third, delete post from Restaurants collection
      const restaurantRef = doc(db, 'Restaurants', restaurantPlaceId);
      const restaurantSnap = await getDoc(restaurantRef);

      if (restaurantSnap.exists()) {
        const { averageRating, postsThatReviewed } = restaurantSnap.data();

       // Divison by zero case
       if (postsThatReviewed.length - 1 === 0) {
        await updateDoc(restaurantRef, {
          averageRating: null
        })
  
        await updateDoc(restaurantRef, {
          postsThatReviewed: arrayRemove(docRef.id)
        })
      } else {
        await updateDoc(restaurantRef, {
          averageRating: ((averageRating * postsThatReviewed.length) - rating)/(postsThatReviewed.length - 1)
        })

        await updateDoc(restaurantRef, {
          postsThatReviewed: arrayRemove(docRef.id)
        })
      }
      }
    }
  }

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

  // useFocusEffect ensures that my home screen refreshes each time I visit home screen
  useFocusEffect(React.useCallback(() => {
    fetchPosts();
  }, []));

  // Re-renders screen when a post has been deleted
  useEffect(() => {
    fetchPosts();
  },[deleted]);

  return (
    <Container> 
      <FlatList  
        data={posts} 
        renderItem={({item}) => <PostCard item={item} onDelete={handleDelete} onPress={() => navigation.navigate("Others Profile", {userId: item.userId})}/>} 
        keyExtractor={item => item.id} 
        showsVerticalScrollIndicator={false} 
      /> 
    </Container>
  );
}

export default FeedsScreen;

// There is no styling stylesheet here as all stylings for this screen
// is imported from '../styles/FeedStyles', where code there is written in CSS.
// This is for active props, ie interactions