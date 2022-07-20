import React, { useContext, useEffect, useState, useRef, memo } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../navigation/AuthProvider';
import moment from 'moment';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { TouchableOpacity, View, Dimensions, Text } from 'react-native';
import { db } from "../firebase";
import StarRating from "react-native-star-rating-widget";
import { useFocusEffect } from '@react-navigation/native';
import { apiKey } from '@env';
import { useNavigation } from '@react-navigation/native';
import { Container, 
    Card, 
    UserInfo, 
    UserImg, 
    UserName, 
    UserInfoText, 
    PostTime, 
    PostText, 
    PostImg, 
    InteractionWrapper, 
    InteractionLiked,
    InteractionUnliked, 
    InteractionTextLiked,
    InteractionTextUnliked } from "../styles/FeedStyles";


const PostCard = ({ item, onDelete, onPress }) => {
    if(item === undefined) return null;
    const {user, logout} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [rating, setRating] = useState(item.rating);
    const [liked, setLiked] = useState(item.likes.includes(user.uid));
    const [likeText, setLikeText] = useState("Like");
    const componentMounted = useRef(true);
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const placeId = item.id;

    // Get the user data from firecloud
  const getUser = async () => {
    const docRef = doc(db, "Users", item.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {  
      setUserData(docSnap.data());
    }
  }

  useFocusEffect(React.useCallback(() => {
    getUser();
    fetchLikes();
  }, []));

  // Fetches places details using placeId
  // Returns detailed results of a single restaurant
  const handlePlaceId = async (place_id) => {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?';
    const placeid = `place_id=${place_id}`;
    const key = `&key=${apiKey}`;
    const placeUrl = url + placeid + key;
    const result = await fetch(placeUrl).then(response => response.json());
    return result;
  }

  const getRestaurantDetails = async (place_id) => {
    const data = await handlePlaceId(place_id);
    const result = data.result;

    console.log("Hi result is: " +  result)
    return result;
  }

  const fetchLikes = async () => {
    const postRef = doc(db, 'Posts', item.id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const { likes } = postSnap.data();
      setLiked(likes.includes(user.uid));
      if (likes.length == 1) {
          setLikeText('1 Like');
      } else if (likes.length > 1) {
        setLikeText(likes.length + ' Likes');;
      } else {
        setLikeText("Like");
      }
      }
  }

  // Likes the post if previously unliked, vice-versa
  const handleLike = async () => {
    setLiked(!liked);
    const postRef = doc(db, 'Posts', item.id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const { likes } = postSnap.data();
      // If user liked it alrd, now unlike it
      if (likes.includes(user.uid)) {
        if (likes.length > 2) {
         setLikeText(likes.length - 1 + ' Likes');;
        } else if (likes.length == 2) {
         setLikeText("1 Like");
        } else {
          setLikeText("Like");
        }
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        })
      // Else if user has not liked it, now like it
      } else {
        if (likes.length == 0) {
          setLikeText('1 Like');
        } else {
          setLikeText(likes.length + 1 + " Likes");
        }
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        })
      }
    } else {
      console.log("Can't like/unlike post due to no post info");
    }
  }
   
    return (
      <View style={{width:windowWidth * 0.9}}>
      <Card>
        <UserInfo>
          <UserImg source={{uri: userData ? userData.userImg : 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}}/>
          <UserInfoText>
            <TouchableOpacity onPress={onPress}>
              <UserName>{userData ? userData.userName : 'Placeholder username'}</UserName>
            </TouchableOpacity>
            <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        {item.restaurant != null ? 
          <View style={{justifyContent:'center', alignItems:'center'}}>
           <Text style={{fontSize:14, fontWeight:'bold'}} onPress={async () => {
            const result = await getRestaurantDetails(item.restaurantPlaceId);
            navigation.navigate("RestaurantScreen", { result });
           }}>{item.restaurant}</Text> 
            <View style={{paddingLeft:0}}>
          <StarRating
            rating={rating}
            onChange={() => {}}
             starSize={14}
         />
          </View>
        </View> :
          <View style={{justifyContent:'center', alignItems:'center'}}>
          <View>
         <StarRating
           rating={rating}
            onChange={() => {}}
            starSize={14}
          />
          </View> 
          </View>}
        <PostText>{item.postText}</PostText>
        <PostImg source={{uri: item.postImg}}/>
        <InteractionWrapper>
          {liked ? 
            <InteractionLiked>
              <TouchableOpacity onPress={handleLike}>
               <Ionicons name={'heart'} size={25} color={'#2e64e5'}/>
             </TouchableOpacity> 
              <TouchableOpacity onPress={() => navigation.navigate("Likes Screen", {placeId})}>
                <InteractionTextLiked>{likeText}</InteractionTextLiked>
              </TouchableOpacity>
            </InteractionLiked>
            :
            <InteractionUnliked>
              <TouchableOpacity onPress={handleLike}>
                <Ionicons name={'heart-outline'} size={25} color={'#333'}/>
              </TouchableOpacity>
             <TouchableOpacity onPress={() => navigation.navigate("Likes Screen", {placeId})}>
              <InteractionTextUnliked>{likeText}</InteractionTextUnliked> 
              </TouchableOpacity>
            </InteractionUnliked>}
          {user.uid === item.userId ? 
             <InteractionUnliked onPress={() => onDelete(item.id)}>
              <Ionicons name='md-trash-bin' size ={25} />
             </InteractionUnliked> 
            : null}
        </InteractionWrapper>
      </Card>
      </View>
    );
}

export default memo(PostCard);