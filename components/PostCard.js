import React, { useContext, useEffect, useState, useRef, memo } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../navigation/AuthProvider';
import moment from 'moment';
import { doc, getDoc } from "firebase/firestore";
import { TouchableOpacity, View } from 'react-native';
import { db } from "../firebase";
import StarRating from "react-native-star-rating-widget";
import { useFocusEffect } from '@react-navigation/native';
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
    Interaction, 
    InteractionText } from "../styles/FeedStyles";


const PostCard = ({ item, onDelete, onPress }) => {
    const {user, logout} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [rating, setRating] = useState(item.rating);
    const componentMounted = useRef(true); 

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
  }, []));

    let likeIcon = item.liked? 'heart' : 'heart-outline';
    let likeIconColor = item.liked? '#2e64e5' : '#333';

    let likeText='';
    if (item.likes == 1) {
        likeText = '1 Like';
    } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
    } else {
        likeText = 'Like';
    }

    let commentText ='';
    if (item.comments == 1) {
        commentText = '1 Comment';
    } else if (item.comments > 1) {
        commentText = item.comments + ' Comments';
    } else {
        commentText = 'Comment';
    }
     
    return (
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
        <View style={{paddingLeft:9}}>
        <StarRating
          rating={rating}
          onChange={() => {}}
          starSize={14}
        />
        </View>
        <PostText>{item.postText}</PostText>
        <PostImg source={{uri: item.postImg}}/>
        <InteractionWrapper>
          <Interaction active = {item.liked}>
            <Ionicons name={likeIcon} size={25} color={likeIconColor}/>
            <InteractionText active={item.liked}>{likeText}</InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name='md-chatbubble-outline' size={25} />
            <InteractionText>{commentText}</InteractionText>
          </Interaction>
          {user.uid === item.userId ? 
          <Interaction onPress={() => onDelete(item.id)}>
          <Ionicons name='md-trash-bin' size ={25} />
          </Interaction> 
        : null}
        </InteractionWrapper>
      </Card>
    );
}

export default memo(PostCard);