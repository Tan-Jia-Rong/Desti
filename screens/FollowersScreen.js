import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { storage, db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { FormInput, UserProfileButton } from '../components';
import { AuthContext } from "../navigation/AuthProvider";


const FollowersScreen = ({ navigation, route }) => {
    const {user} = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    
    // const q = query(collection(db, 'Posts'), where('userId', "==", route.params ? route.params.userId : user.uid), orderBy("postTime", "desc"));
    const fetchUsers = async (searchString) => {
        try {
            const docRef = doc(db, 'Following', route.params ? route.params.userId : user.uid);
            const docSnap = await getDoc(docRef);
            const {followers} = docSnap.data();
            console.log(followers);
            console.log("Fetched followers!");

            const arr = [];
            const q = query(collection(db, 'Users'), where('userName', '>=', searchString), orderBy("userName"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const {userName, userImg, userId} = doc.data();
                if (followers.includes(userId)) {
                     // For each doc in the firecloud database, push it into the array
                arr.push({
                    id: doc.id,  
                    userName,
                    userImg,
                    userId
                  });
                }
              }, []);

        setUsers(arr);
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchUsers("");
    }, [])

  
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <View styles={styles.inner}>
              <FormInput
                onChangeText = {(searchString) => (
                    fetchUsers(searchString)
                )}
                  placeHolderText = "Search Followers"
                  iconType = "search1"
                  autoCapitalize = "none"
                  autocorrect = {false}
              />

              <FlatList
                onScroll={() => Keyboard.dismiss()}
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => <UserProfileButton item={item} onPress={() => navigation.navigate("Others Profile", {userId: item.id})}/>}
              />

            </View>
          </View>
        </TouchableWithoutFeedback>
    );
  }
  
  export default FollowersScreen;

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