import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Text, View, Image, StyleSheet, FlatList, Button, Dimensions } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { apiKey } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from "../navigation/AuthProvider";
import { collection, addDoc, Timestamp, doc, setDoc, updateDoc, getDoc, arrayUnion, increment, query, where, getDocs, deleteField } from "firebase/firestore";
import { storage, db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";

  // Definition of Bookmark
  // 1. place_id
  // 2. name
  // 3. image

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const BookmarkScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [listData, setListData] = useState([]);
  let row: Array<any> = [];
  let prevOpenedRow;

  // Fetches places details using placeId
  const handlePlaceId = async (place_id) => {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?';
    const placeid = `place_id=${place_id}`;
    const key = `&key=${apiKey}`;
    const placeUrl = url + placeid + key;
    const result = await fetch(placeUrl).then(response => response.json());
    return result;
  }

  const fetchBookmarks = async () => {
    const bookmarkRef = doc(db, "userBookmarks", user.uid);
    const bookmarkSnap = await getDoc(bookmarkRef);
    const arr = [];

    if (bookmarkSnap.exists()) {
      const obj = bookmarkSnap.data();
      for (let i = 0; i < Object.entries(obj).length; i++) {
        arr.push({
          photo: Object.entries(obj)[i][1].photo,
          placeId: Object.entries(obj)[i][0],
          name:  Object.entries(obj)[i][1].name
        });
      }
      arr.sort((a, b) => {
        if (a.name <= b.name) {
          return -1;
        } else {
          return 1;
        }
      })
      console.log(arr);
      setListData(arr);
    } else {
      setListData([]);
    }
  }

   // useFocusEffect ensures that bookmark screen refreshes everytime I visit it
   useFocusEffect(React.useCallback(() => {
    fetchBookmarks();
  }, []));

  const renderItem = ({ item, index }, onClick) => {
    //
    const closeRow = (index) => {
      console.log('closerow');
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = (progress, dragX, onClick) => {
      return (
        <View
          style={{
            margin: 0,
            alignContent: 'center',
            justifyContent: 'center',
            width: 100,
            backgroundColor: '#ff4d4d'
          }}>
          <Button 
            color='blue'
            onPress={onClick} 
            title="DELETE">
          </Button>
        </View>
      );
    };

    return (
      <GestureHandlerRootView
      >
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, onClick)
          }
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref) => (row[index] = ref)}
          rightOpenValue={-100}
          >
            <TouchableOpacity
              style={styles.bookmarkContainerInner}
              onPress={async () => {
                const data = await handlePlaceId(item.placeId)
                const result = data.result
                result ? navigation.navigate("RestaurantScreen", {result})
                       : null;
              }}
            >
              <Text style={styles.bookmarkText}>{item.name}</Text>
              <Image
                source={{uri: item.photo}}
                style={styles.bookmarkImage}
              />
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  // To Do : Update to delete from database
  const deleteItem = async ({ item, index }) => {
    const bookmarkRef = doc(db, "userBookmarks", user.uid);
    const bookmarkSnap = await getDoc(bookmarkRef);
    console.log(item, index);
    let a = listData;
    a.splice(index, 1);
    console.log(a);
    setListData([...a]);
    if (bookmarkSnap.exists()) {
      const placeId = item.placeId;
      await updateDoc(bookmarkRef, {
        [placeId]: deleteField()
    });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        style={styles.bookmarkContainerOuter}
        renderItem={(v) =>
          renderItem(v, () => {
            console.log('Pressed', v);
            deleteItem(v);
          })
        }
        keyExtractor={(item) => item.placeId}></FlatList>
    </View>
  );
}


export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 20,
    color: '#333333'
  },
  bookmarkContainerOuter: {
    height: '15%', 
    width:'100%',
  },
  bookmarkContainerInner: {
    flex: 1, 
    flexDirection:'row', 
    height: HEIGHT /8,
    paddingBottom: 1,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  bookmarkText: {
    flex: 0.7,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  bookmarkImage: {
    flex: 0.3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
})