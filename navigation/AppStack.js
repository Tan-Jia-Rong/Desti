import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { ProfileScreen, MapScreen, RestaurantScreen, 
    RouletteScreen, FeedsScreen, AddReviewScreen, 
    EditProfileScreen, SearchUsersScreen, OthersProfileScreen, 
    FollowersScreen, FollowingScreen, InputScreen, 
    DirectionScreen, RestaurantGetScreen, BookmarkScreen, ListOfRestaurantsScreen} from "../screens";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const FeedsStack = ({navigation}) => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={FeedsScreen}
                options={{
                    headerRight: () => (
                        <View style={{marginRight: 10}}>
                            <Ionicons 
                            name="add-circle-outline" 
                            size={25}
                            onPress={() => navigation.navigate("AddReviews")}
                            />
                        </View>
                    )
                }}
            />

            <Stack.Screen
                name="AddReviews"
                component={AddReviewScreen}
                options={{
                    headerTitle: "Add Review",
                    headerTitleAlign: 'center'
                }}
            />

            <Stack.Screen
                name="Get Restaurant"
                component={RestaurantGetScreen}
            />

            <Stack.Screen
                name="Others Profile"
                component={OthersProfileScreen}
                options={{
                    headerTitle: "",
                    headerTransparent: true
                }}
            />

            <Stack.Screen
                name="Bookmark"
                component={BookmarkScreen}
            />

            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerRight: () => (
                        <View style={{marginRight: 10}}>
                            <Ionicons 
                            name="person-add" 
                            size={25}
                            onPress={() => navigation.navigate("Search Users")}
                            />
                        </View>
                    )
                }}
            />

            <Stack.Screen
                name="Edit Profile"
                component={EditProfileScreen}
                options={{
                    headerTitle: 'Edit Profile',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                    }
                }}
            />

            <Stack.Screen
                name="Search Users"
                component={SearchUsersScreen}
                options={{
                    headerTitle: 'Search Users',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                    }
                }}
            />

        <Stack.Screen
                name="Followers"
                component={FollowersScreen}
            />

        <Stack.Screen
                name="Following"
                component={FollowingScreen}
            />
        
        <Stack.Screen
                name="RestaurantScreen"
                component={RestaurantScreen}
                options={({route}) => (
                    // Logic Flow for checking if restaurant exist
                    route.params.result === null 
                    ? {headerTitle: "Restaurant Page"} 
                    : {headerTitle: route.params.result.name,
                        headerBackTitleVisible: false,
                        headerTitleAlign: 'center',
                        headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                        }
                      }
                )}
            />
        </Stack.Navigator>
    )
}

const ProfileStack = ({navigation}) => {
    return (
    <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen
                name="Bookmark"
                component={BookmarkScreen}
            />

            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerRight: () => (
                        <View style={{marginRight: 10}}>
                            <Ionicons 
                            name="person-add" 
                            size={25}
                            onPress={() => navigation.navigate("Search Users")}
                            />
                        </View>
                    )
                }}
            />

            <Stack.Screen
                name="Edit Profile"
                component={EditProfileScreen}
                options={{
                    headerTitle: 'Edit Profile',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                    }
                }}
            />

            <Stack.Screen
                name="Search Users"
                component={SearchUsersScreen}
                options={{
                    headerTitle: 'Search Users',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                    }
                }}
            />

            <Stack.Screen
                name="Others Profile"
                component={OthersProfileScreen}
                options={{
                    headerTitle: "",
                    headerTransparent: true
                }}
            />

            <Stack.Screen
                name="Followers"
                component={FollowersScreen}
            />

            <Stack.Screen
                name="Following"
                component={FollowingScreen}
            />

            <Stack.Screen
                name="RestaurantScreen"
                component={RestaurantScreen}
                options={({route}) => (
                    // Logic Flow for checking if restaurant exist
                    route.params.result === null 
                    ? {headerTitle: "Restaurant Page"} 
                    : {headerTitle: route.params.result.name,
                        headerBackTitleVisible: false,
                        headerTitleAlign: 'center',
                        headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                        }
                      }
                )}
            />

            <Stack.Screen
                name="Map"
                component={DirectionScreen}
            />
        </Stack.Navigator>
    );
}

const RestaurantStack = ({route, navigation}) => {
    return (
        <Stack.Navigator initialRouteName="InputScreen">
            <Stack.Screen
                name="InputScreen"
                component={InputScreen}
                options={{
                    headerTitle: "Restaurant Search"
                }}
            />

            <Stack.Screen
              name="ListOfRestaurantsScreen"
              component={ListOfRestaurantsScreen}
              options={{
                headerTitle: "Returned results"
            }}
            />

            <Stack.Screen
                name="RestaurantScreen"
                component={RestaurantScreen}
                options={({route}) => (
                    // Logic Flow for checking if restaurant exist
                    route.params.result === null 
                    ? {headerTitle: "Restaurant Page"} 
                    : {headerTitle: route.params.result.name,
                        headerBackTitleVisible: false,
                        headerTitleAlign: 'center',
                        headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                        }
                      }
                )}
            />

            <Stack.Screen
                name="Map"
                component={DirectionScreen}
            />

            <Stack.Screen
                name="Others Profile"
                component={OthersProfileScreen}
                options={{
                    headerTitle: "",
                    headerTransparent: true
                }}
            />

            <Stack.Screen
                name="Edit Profile"
                component={EditProfileScreen}
                options={{
                    headerTitle: 'Edit Profile',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                    }
                }}
            />
            <Stack.Screen
                name="Followers"
                component={FollowersScreen}
            />

            <Stack.Screen
                name="Following"
                component={FollowingScreen}
            />
        </Stack.Navigator>
    )
}

const MapStack = ({route, navigation}) => {
    return (
        <Stack.Navigator initialRouteName="MapScreen">
            <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="map-outline" color ={color} size={size}/>
                    ),
                    headerTitle: "Map"
                }}
            />
            <Stack.Screen
                name="RestaurantScreen"
                component={RestaurantScreen}
                options={({route}) => (
                    // Logic Flow for checking if restaurant exist
                    route.params.result === null 
                    ? {headerTitle: "Restaurant Page"} 
                    : {headerTitle: route.params.result.name,
                        headerBackTitleVisible: false,
                        headerTitleAlign: 'center',
                        headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                        }
                      }
                )}
            />

            <Stack.Screen
                name="Map"
                component={DirectionScreen}
            />

            <Stack.Screen
                name="Others Profile"
                component={OthersProfileScreen}
                options={{
                    headerTitle: "",
                    headerTransparent: true
                }}
            />

            <Stack.Screen
                name="Edit Profile"
                component={EditProfileScreen}
                options={{
                    headerTitle: 'Edit Profile',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                    }
                }}
            />
            <Stack.Screen
                name="Followers"
                component={FollowersScreen}
            />

            <Stack.Screen
                name="Following"
                component={FollowingScreen}
            />
        </Stack.Navigator>
    )
}

const RouletteStack = ({ route, navigation }) => {
    return (
        <Stack.Navigator initialRouteName="Roulette Screen">
            <Stack.Screen
                name="Roulette Screen"
                component={RouletteScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="help" color ={color} size={size}/>
                    )
                }}
            />

            <Stack.Screen
                name="Restaurant Screen"
                component={RestaurantScreen}
                options={({route}) => (
                    // Logic Flow for checking if restaurant exist
                    route.params.result === null 
                    ? {headerTitle: "Restaurant Page"} 
                    : {headerTitle: route.params.result.name,
                        headerBackTitleVisible: false,
                        headerTitleAlign: 'center',
                        headerStyle: {
                        backgroundColor: '#fff',
                        shadowColor: '#fff',
                        elevation: 0
                        }
                      }
                )}
            />

            <Stack.Screen
            name="Map"
            component={DirectionScreen}
            />
         </Stack.Navigator>
    )
}

const AppStack = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={FeedsStack}
                options={{
                    header: () => null,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="home-outline"
                            color={color}
                            size={size}
                       />
                    )
                    }}
            />

            <Tab.Screen
                name="Restaurant"
                component={RestaurantStack}
                options={{
                    header: () => null,
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="restaurant-outline" color ={color} size={size}/>
                    )
                }}
            />

            <Tab.Screen
                name="Map"
                component={MapStack}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="map-outline" color ={color} size={size}/>
                    ),
                    header: () => null
                }}
            />

            <Tab.Screen
                name="Roulette"
                component={RouletteStack}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="help" color ={color} size={size}/>
                    ),
                    header: () => null
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    header: () => null,
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="person-outline" color ={color} size={size}/>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default AppStack