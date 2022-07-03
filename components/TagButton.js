import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'

const TagButton = ({tagName, onPressHandler, backgroundColor, borderColor, textColor}) => {
    const styles = makeStyles(backgroundColor, borderColor, textColor);
    return (
      <TouchableOpacity 
        style={styles.touchable}
        onPress={onPressHandler}
        >
        <View style={styles.view}>
          <Text style={styles.text}>{tagName}</Text>
        </View>
      </TouchableOpacity>
    )
}

export default TagButton;

const makeStyles = (backgroundColor, borderColor, textColor) => {
    return StyleSheet.create({
      view: {
        flexDirection: 'row',
        borderRadius: 23,
        borderColor: borderColor,
        borderWidth: 2,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        paddingLeft: 16,
        paddingRight: 16
      },
      touchable: {
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 8
      },
      text: {
        fontSize: 18,
        textAlign: 'center',
        color: textColor,
        fontSize: 16
      }
    })
}