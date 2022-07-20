import styled from 'styled-components';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    background-color: #fff;
`;

// A card is essentially a post
export const Card = styled.View`
    background-color: #f8f8f8;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 10px
`;

// The container for UserImg and UserInfoText, but excludes PostText and PostImg
export const UserInfo = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    padding: 15px;
`;

export const UserImg = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 25px;
`;

// The container for UserName and PostTime
export const UserInfoText = styled.View`
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
`;

export const UserName = styled.Text`
    font-size: 14px;
    font-weight: bold;
`;


// Eg 2 hours ago
export const PostTime = styled.Text`
    font-size: 12px;
    color: #666;
`;

// The content of the post
export const PostText = styled.Text`
    font-size: 14px;
    padding-left: 15px;
    padding-right: 15px;
`;

export const PostImg = styled.Image`
    width: 100%;
    height: 250px;
    margin-top: 15px;
`;

// Wrapper for both like and comment button, ie wrapper for Interaction
export const InteractionWrapper = styled.View`
    flex-direction: row;
    justify-content: space-around;
    padding: 15px;
`;

// Wrapper for either the like button alone
export const InteractionLiked = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    border-radius: 5px;
    padding: 2px 5px;
    background-color: '#2e64e515';
`;

export const InteractionUnliked = styled.TouchableOpacity`
flex-direction: row;
justify-content: center;
border-radius: 5px;
padding: 2px 5px;
background-color: 'transparent';
`;

export const InteractionTextLiked = styled.Text`
    font-size: 12px;
    font-weight: bold;
    margin-top: 5px;
    margin-left: 5px;
`;

export const InteractionTextUnliked = styled.Text`
font-size: 12px;
font-weight: bold;
margin-top: 5px;
margin-left: 5px;
`;