import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { FormButton, FormInput } from "../components";
import { AuthContext } from "../navigation/AuthProvider";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';


const EditProfileScreen = () => {
  return (
    <View style = {styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{margin: 20}}>
          <View style = {{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {}}>
              <View style={{
                height:100,
                width:100,
                borderRadius:15,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ImageBackground
                  source={{uri: 'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png'}}
                  style={{height: 100, width: 100}}
                  imageStyle={{borderRadius: 15}}
                >
                  <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Icon 
                      name="camera" 
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10
                      }}/>
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
            <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
              Placeholder edit
            </Text>
          </View>

          
          <FormInput
            placeHolderText = "Username"
            iconType = "user"
            autoCapitalize = "none"
            autocorrect = {false}
            />
          <FormInput
            placeHolderText = "Email"
            iconType = "mail"
            keyboardType = "email-address"
            autoCapitalize = "none"
            autocorrect = {false}
            />

          <FormButton
            buttonTitle="Update"
            onPress = {() => {}}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}


export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#00008B',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: -4,
    paddingLeft: 10,
    color: '#05375a',
  }
});