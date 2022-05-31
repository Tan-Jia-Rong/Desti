import { BottomTabBar } from "@react-navigation/bottom-tabs"
import { useState, useEffect, useContext } from "react"
import { Text, View, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity} from "react-native"
import { FormButton } from "../components"
import { AuthContext } from "../navigation/AuthProvider"
import firestore from '@react-native-firebase/firestore';


const ProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);

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
      <Text style = {styles.userName}>Placeholder username</Text>
      <Text style = {styles.aboutUser}>Placeholder user information</Text>

      <View style={styles.userBtnWrapper}>
        <TouchableOpacity style = {styles.userBtn} onPress={() => {}}>
          <Text style = {styles.userBtnTxt}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.userBtn} onPress={() => logout()}>
          <Text style = {styles.userBtnTxt}>Logout</Text>
        </TouchableOpacity>
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