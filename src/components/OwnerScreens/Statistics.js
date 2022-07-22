import React, { Component,PureComponent } from 'react';
import {StyleSheet,BackHandler, Alert,View,Dimensions,ScrollView,Image,Button,Touchable,TouchableOpacity,TouchableHighlight,TextInput,SafeAreaView,Animated,Keyboard,TouchableWithoutFeedback} from 'react-native';
import {Container,Header,Left,Right,Icon,Text,Body } from 'native-base';
import firebase  from 'firebase';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }
  firebase.firestore().settings({ experimentalForceLongPolling: true });//fixed firestore bug

  _isMounted=false//used so that mounted error do not shows

const { width, height } = Dimensions.get('window');


class Statistics extends React.Component {
  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.goBack() }
    ]);
    return true;
  };

  componentDidMount() {
    
  }

  componentWillUnmount() {
  }
  

  render() {
    
    return (
        <View style={{position:'absolute'}}>
         <Text>Test</Text>
         
        </View>
  );
    
  }
}// End of MyHomeScreen class
export default Statistics;

const styles=StyleSheet.create({
 

})