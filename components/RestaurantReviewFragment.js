import React, {useCallback, useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, Alert} from "react-native";
import { storage, db } from "../firebase";
import { collection, getDocs, query, doc, getDoc, deleteDoc, where, orderBy, arrayRemove, updateDoc } from "firebase/firestore";
import  PostCard  from './PostCard';
import { ref, deleteObject } from "firebase/storage";
import { StyleSheetManager } from 'styled-components';
import { useFocusEffect } from "@react-navigation/native";

const RestaurantReviewFragment = ({ navigation, placeId }) => {
    const [reviews, setReviews] = useState(null);
    const [deleted, setDeleted] = useState(false);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const restaurantRef = doc(db, 'Restaurants', placeId);
            const restaurantSnap = await getDoc(restaurantRef);

            // If there is at least one review done by our app users
            if (restaurantSnap.exists()) {
                const {postsThatReviewed} = restaurantSnap.data();

                const reviewArr = [];
                const q = query(collection(db, 'Posts'), orderBy('postTime', 'desc'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const { comments, likes, postImg, postText, postTime, rating, userId, restaurant } = doc.data();
                    if (postsThatReviewed.includes(doc.id)) {
                        reviewArr.push({
                            id: doc.id,
                            comments,
                            likes,
                            postImg,
                            postText,
                            postTime,
                            rating,
                            userId,
                            restaurant
                        });
                    }
                }, []);

                setReviews(reviewArr);
                setReviewCount(reviewArr.length);
                setLoading(false);
            // Else if there is not even one review done by our app users    
            } else {
              setLoading(false);
            }
          } catch(e) {
            console.log(e);
          }
    }

  // useFocusEffect ensures that restaurant screen refreshes everytime I visit it
  useFocusEffect(React.useCallback(() => {
    fetchReviews();
  }, []));


    useEffect(() => {
        fetchReviews();
    }, [deleted])

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
          averageRating: 0
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

  while(loading) return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}> Reviews </Text>
        </View>
        <Text style={styles.noReviewText}> Loading... </Text>
    </View>
  )

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}> Reviews </Text>
        </View>
        { reviewCount > 0 ? 
        <View style={styles.reviewPhotoContainer}>
            {reviewCount >= 1 ? 
             <PostCard item={reviews[0]} onDelete={handleDelete} onPress={() => navigation.navigate("Others Profile", {userId: reviews[0].userId})}/> 
              : null }
            {reviewCount >= 2 ? 
             <PostCard item={reviews[1]} onDelete={handleDelete} onPress={() => navigation.navigate("Others Profile", {userId: reviews[1].userId})}/>
             : null }
           {reviewCount >= 3 ? 
             <PostCard item={reviews[2]} onDelete={handleDelete} onPress={() => navigation.navigate("Others Profile", {userId: reviews[2].userId})}/>
             : null }
            {reviewCount >= 4 ? 
             <PostCard item={reviews[3]} onDelete={handleDelete} onPress={() => navigation.navigate("Others Profile", {userId: reviews[3].userId})}/>
             : null }
            {reviewCount >= 5 ? 
             <PostCard item={reviews[4]} onDelete={handleDelete} onPress={() => navigation.navigate("Others Profile", {userId: reviews[4].userId})}/>
             : null }
        </View> :
        <View style={styles.reviewPhotoContainer}>
          <Image 
            style={styles.imageContainer}
            source={require('../assets/personalizedIcon.png')}
          />
          <Text style={styles.noReviewText}>
            There is currently no Review
          </Text>
        </View>
        }
    </View>
    )
}

export default RestaurantReviewFragment;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderTopColor: 'black'
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewPhotoContainer: {
        flex: 0.8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        marginBottom: 70
    },
    imageContainer: {
        height: 300,
        width: '100%',
        marginBottom: 5
    },
    noReviewText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: "grey",
      textAlign: 'center',
      paddingTop: 5
    },
})