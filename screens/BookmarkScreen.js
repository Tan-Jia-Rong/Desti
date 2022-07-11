import * as React from 'react';
import { useState } from 'react';
import { Text, View, Image, StyleSheet, FlatList, Button, Dimensions } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { apiKey } from '@env';
import { NavigationContainer } from '@react-navigation/native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

// Fetches places details using placeId
const handlePlaceId = async (place_id) => {
  const url = 'https://maps.googleapis.com/maps/api/place/details/json?';
  const placeid = `place_id=${place_id}`;
  const key = `&key=${apiKey}`;
  const placeUrl = url + placeid + key;
  const result = await fetch(placeUrl).then(response => response.json());
  return result;
}


  // Definition of Bookmark
  // 1. place_id
  // 2. name
  // 3. image

const fakeData = [
  {
    place_id: "ChIJ1f9Gi8YV2jERWukfruuoJNw" ,
    name: "This shall be macdonalds",
    image: "https://animegalaxyofficial.com/wp-content/uploads/2021/04/solo-leveling-anime-adaptation.jpg"
  },
  {
    place_id: "2" ,
    name: "Fake Data 1",
    image: "https://animegalaxyofficial.com/wp-content/uploads/2021/04/solo-leveling-anime-adaptation.jpg"
  },
  {
    place_id: "3" ,
    name: "Fake data 2",
    image: "https://animegalaxyofficial.com/wp-content/uploads/2021/04/solo-leveling-anime-adaptation.jpg"
  },
  {
    place_id: "4" ,
    name: "Fake data 3",
    image: "https://animegalaxyofficial.com/wp-content/uploads/2021/04/solo-leveling-anime-adaptation.jpg"
  },
  {
    place_id: "5" ,
    name: "Fake data 4",
    image: "https://animegalaxyofficial.com/wp-content/uploads/2021/04/solo-leveling-anime-adaptation.jpg"
  },
];


const BookmarkScreen = ({navigation}) => {
  const [listData, setListData] = useState(fakeData);
  let row: Array<any> = [];
  let prevOpenedRow;

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
            color='white'
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
                const data = await handlePlaceId(item.place_id)
                const result = data.result
                result ? navigation.navigate("RestaurantScreen", {result})
                       : null;
              }}
            >
              <Text style={styles.bookmarkText}>{item.name}</Text>
              <Image
                source={{uri: item.image}}
                style={styles.bookmarkImage}
              />
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  // To Do : Update to delete from database
  const deleteItem = ({ item, index }) => {
    console.log(item, index);
    let a = listData;
    a.splice(index, 1);
    console.log(a);
    setListData([...a]);
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
        keyExtractor={(item) => item.place_id}></FlatList>
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