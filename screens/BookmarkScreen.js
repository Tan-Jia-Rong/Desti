import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView} from "react-native"
import { apiKey } from '@env';

// Fetches places details using placeId
const handlePlaceId = async (place_id) => {
  const url = 'https://maps.googleapis.com/maps/api/place/details/json?';
  const placeid = `place_id=${place_id}`;
  const key = `&key=${apiKey}`;
  const placeUrl = url + placeid + key;
  const result = await fetch(placeUrl).then(response => response.json());
  return result;
}



const BookmarkScreen = ({navigation, route}) => {

  // Definition of Bookmark
  // 1. place_id
  // 2. name
  // 3. image

  // Array of Bookmarks to be taken from storage
  const arr = [];

  // To be used in return to return list of bookmark
  const renderBookmark = (bookmarks) => {
    return (
      bookmarks.map((bookmark) => (
        <Bookmark
          name={bookmark.name}
          place_id={bookmark.place_id}
          image={bookmark.image}
        />
      ))
    )
  } 

  const Bookmark =  ({place_id, name, image}) => {
    return (
      <TouchableOpacity 
        style={styles.bookmarkContainer}
        onPress={async () => {
          const data = await handlePlaceId(place_id)
          const result = data.result
          navigation.navigate("RestaurantScreen", {result});
        }}
      >
          <Text style={styles.bookmarkText}> {name} </Text>

          <Image 
            style={styles.bookmarkImage}
            source={{uri: image}}
          />
      </TouchableOpacity>
    );

  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Bookmark
          place_id={"ChIJ1f9Gi8YV2jERWukfruuoJNw"}
          name={"This shall be macdonalds"}
          image={"https://animegalaxyofficial.com/wp-content/uploads/2021/04/solo-leveling-anime-adaptation.jpg"}
        />
        <Bookmark
          place_id={"ChIJ1f9Gi8YV2jERWukfruuoJNw"}
          name={"This shall be macdonalds"}
          image={"https://animegalaxyofficial.com/wp-content/uploads/2021/04/solo-leveling-anime-adaptation.jpg"}
        />
    </ScrollView>
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
  bookmarkContainer: {
    height: '15%', 
    width:'100%',
    flexDirection: 'row',
    paddingBottom: 1,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  bookmarkText: {
    flex: 1,
    flexWrap: 'wrap',
    width: '70%',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  bookmarkImage: {
    height: '100%',
    width: '30%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
})