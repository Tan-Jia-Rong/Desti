import React, {useCallback, useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import PostCard from '../components/PostCard';
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";


import { Container } from "../styles/FeedStyles";

const FeedsScreen = () => {
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(React.useCallback(() => {
    const fetchPosts = async () => {
      try {
        const arr = [];
        const q = query(collection(db, 'Posts'), orderBy("postTime", "desc"));
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

    fetchPosts();
  }, []));

  return (
    <Container>
      <FlatList 
        data={posts}
        renderItem={({item}) => <PostCard item={item} />}
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