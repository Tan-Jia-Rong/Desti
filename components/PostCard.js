import { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../navigation/AuthProvider';
import moment from 'moment';
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

const PostCard = ({ item, onDelete }) => {
    const {user, logout} = useContext(AuthContext);

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
          <UserImg source={item.userImg}/>
          <UserInfoText>
            <UserName>{item.userName}</UserName>
            <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
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

export default PostCard;