import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const DetailFragment = ({address, phoneNumber, status, openingArr, priceLevel, ratings, location, navigation}) => {
    const [destination, setDestination] = useState(location);
    return (
        <View style={{flex: 1}}>
            <View style={styles.locationContainer}>
                <Text>{address}</Text>
                <Text>Phone: {phoneNumber ? phoneNumber : "Not Applicable"}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <View style={styles.leftTopContainer}>
                    <Text>Pricing: {priceLevel ? priceLevel + " / 5" : "Not Applicable"}</Text>
                    <Text>Ratings: {ratings} / 5.0</Text>
                    <Text>Status: {status === undefined ? "Not Applicable"
                                    : status ? "Open" : "Closed"} </Text>
                    </View>
                </View>
                
                <ScrollView style={StyleSheet.rightContainer}>
                    
                    <Text>Opening Hours</Text>
                    {openingArr.map(openingHours => {
                        return <Text key={openingHours}>{openingHours}</Text>;
                    })}
                    
                </ScrollView>
            </View>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                    navigation.navigate("Map", { destination })}}
            >
                <Text style={styles.buttonText}> Get Direction </Text>
            </TouchableOpacity>
        </View>
    );
}

export default DetailFragment;

const styles = StyleSheet.create({
    container: {
        flex: 0.6, 
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    locationContainer: {
        height: '20%',
        width: '100%',
        alignItems: 'flex-start',
        paddingLeft: 20,
    },
    leftContainer: {
        height: '100%',
        width: '50%',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingLeft: 10,
    },
    leftTopContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        paddingLeft: 10,
    },
    rightContainer: {
        flex: 1,
        width: '50%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
    },
    buttonContainer: {
        flex: 0.15,
        backgroundColor: '#2e64e5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },

})