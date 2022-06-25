import React from 'react';
import { StyleSheet, Text, View, Image} from "react-native"

const RestaurantReviewFragment = () => {
    return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}> Reviews </Text>
        </View>
        <View style={styles.reviewPhotoContainer}>
            <Image
                source={{uri: 'http://citiusmag.com/wp-content/uploads/2018/04/never-gonna-give-you-up-gif-3.gif'}}
                style={styles.imageContainer}
            />
            <Image
                source={{uri: 'http://citiusmag.com/wp-content/uploads/2018/04/never-gonna-give-you-up-gif-3.gif'}}
                style={styles.imageContainer}
            />
            <Image
                source={{uri: 'http://citiusmag.com/wp-content/uploads/2018/04/never-gonna-give-you-up-gif-3.gif'}}
                style={styles.imageContainer}
            />
            <Image
                source={{uri: 'http://citiusmag.com/wp-content/uploads/2018/04/never-gonna-give-you-up-gif-3.gif'}}
                style={styles.imageContainer}
            />
            <Image
                source={{uri: 'http://citiusmag.com/wp-content/uploads/2018/04/never-gonna-give-you-up-gif-3.gif'}}
                style={styles.imageContainer}
            />
        </View>
    </View>
    )
}

export default RestaurantReviewFragment;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderTopColor: 'black'
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewPhotoContainer: {
        flex: 0.8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    imageContainer: {
        height: 300,
        width: '100%',
        marginBottom: 5
    }

})