import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { storage, db } from "../firebase";
import { collection, getDocs, query, doc, getDoc, deleteDoc, where, orderBy } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const renderTags = (tagArr) => {
    return (
        tagArr.map((tag) => (
            <Text style={styles.tagText} key={tag}> • {tag} </Text>
    )))
}

const renderOpeningDays = (openingDays) => {
    if (openingDays === "Not Applicable") {
        return (<Text> {openingDays} </Text>)
    }

    return (
        openingDays.map(openingHours => (
                <Text key={openingHours}>{openingHours}</Text>
    )))
}

const RestaurantFragment = ({restaurantName, tagArr}) => {
    return (
    <View style={styles.sectionContainer}>
        <View style={styles.descriptionContainer}>
            <Text style={styles.boldText}>
                {restaurantName}
            </Text>
        </View>
        <View style={styles.descriptionContainer}>
            {renderTags(tagArr)}
        </View>
    </View>

    )
}

const OverviewFragment = ({address, openingArr, priceLevel, ratings, phoneNumber}) => {
        const status = openingArr === undefined ? "Not Applicable" : openingArr.open_now;
        const openingDays = openingArr === undefined ? "Not Applicable" : openingArr.weekday_text;
        const [display, setDisplay] = useState(false);
    return (
        <View style={styles.sectionContainer}>
            <View style = {styles.descriptionContainer}>
                <Text style={styles.normalText}> 
                    <MaterialCommunityIcons 
                        name='map-marker'
                        size={18}
                    />
                    {address} 
                </Text>
            </View>
            <View style = {styles.descriptionContainer}>
                <MaterialCommunityIcons 
                    name='clock-outline'
                    size={18}
                />
                <TouchableOpacity
                    onPress={() => setDisplay(!display)}
                >
                    {status === undefined ? <Text> Not Applicable </Text>
                    :status ? <Text style={styles.openText}> Open </Text>
                            : <Text style={styles.closeText}> Closed </Text>
                    }
                </TouchableOpacity>
            </View>
            {display ? 
            < View style={styles.openingDaysContainer}>
                    {renderOpeningDays(openingDays)}
            </View> : null }
            <View style = {styles.descriptionContainer}>
                <MaterialCommunityIcons 
                    name='currency-usd'
                    size={18}
                />
                <Text style={styles.normalText}> 
                    {priceLevel ? " " + priceLevel + " / 5"
                                : "Not Applicable"} 
                </Text>
            </View>
            <View style = {styles.descriptionContainer}>
                <MaterialCommunityIcons 
                    name='star'
                    size={18}
                />
                <Text style={styles.normalText}> {ratings} / 5.0 </Text>
            </View>
            <View style = {styles.descriptionContainer}>
                <MaterialCommunityIcons 
                    name='phone'
                    size={18}
                />
                <Text style={styles.normalText}> {phoneNumber} </Text>
            </View>
        </View>
    )
}

const DetailFragment = ({address, phoneNumber, openingArr, priceLevel, ratings, restaurantName, tagArr}) => {
    return (
        <View style={styles.container}>
            <RestaurantFragment
                restaurantName={restaurantName}
                tagArr={tagArr}
            />
            <OverviewFragment
                address={address}
                openingArr={openingArr}
                priceLevel={priceLevel}
                ratings={ratings}
                phoneNumber={phoneNumber}
            />
        </View>
    )
}

export default DetailFragment;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width:'100%',
      padding: 1,
      backgroundColor: '#ebebeb'
    },
    sectionContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 1,
        width: '100%',
        backgroundColor: 'white',
        marginBottom: 5
    },
    descriptionContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginBottom: 5,
    },
    openingDaysContainer: {
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 5,
        marginLeft: 20
      },
    leftContainer: {
      flex: 0.33,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    rightContainer: {
      flex: 1,
      marginRight: 2,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    boldText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    normalText: {
      fontSize: 14,
      fontWeight: 'normal',
    },
    tagText: {
        color: 'grey'
    },
    missingText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'grey'
    },
    openText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#30ba50'
    },
    closeText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#ab2b31'
    }
  
});