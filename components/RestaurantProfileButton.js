import { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { AuthContext } from '../navigation/AuthProvider';

import { Container, 
    Card, 
    UserInfo, 
    UserImg, 
    UserName, 
    UserInfoText, 
    PostTime } from "../styles/FeedStyles";

const RestaurantProfileButton = ({ item, onPress }) => { 
      
    return ( 
    <UserInfo>  
        <UserInfoText> 
            <TouchableOpacity onPress={onPress}> 
                <UserName>{item.name}</UserName>
            </TouchableOpacity> 
        </UserInfoText> 
    </UserInfo> 
    ); 
} 

export default RestaurantProfileButton;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
      backgroundColor: '#f8f8f8',
      alignSelf: 'stretch',
      marginBottom: 20,
      borderRadius: 10
    },
    userInfo: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 15
    },
    userImg: {
      width: 50,
      height: 50,
      borderRadius: 25
    },
    userInfoText: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 10
    },
    userName : {
      fontSize: 14,
      fontWeight: 'bold'
    }
  });