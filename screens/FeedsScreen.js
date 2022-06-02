import { useContext, useEffect } from "react";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import PostCard from '../components/PostCard';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";


import { Container } from "../styles/FeedStyles";

// Fake data, an array of data
const Posts = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/this_is_fine.jpg'),
    postTime: '4 mins ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/mike.png'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'Ken William',
    userImg: require('../assets/mike.png'),
    postTime: '1 hours ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/this_is_fine.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Selina Paul',
    userImg: require('../assets/this_is_fine.jpg'),
    postTime: '1 day ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/mike.png'),
    liked: false,
    likes: '22',
    comments: '4',
  }
];

const FeedsScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Posts'));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        })
      } catch(e) {
        console.log(e);
      }
    }

    fetchPosts();
  }, []);

  return (
    <Container>
      <FlatList 
        data={Posts}
        renderItem={({item}) => <PostCard item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

export default FeedsScreen;

// There is no styling stylesheet here as all stylings for this screen
// is imported from '../styles/FeedStyles', where code there is written in CSS.
// This is for active props, ie interactions