import React, { Component,PureComponent } from 'react';
import {StyleSheet,BackHandler, Alert,View,Dimensions,ScrollView,Image,Button,Touchable,TouchableOpacity,TouchableHighlight,TextInput,SafeAreaView,Animated,Keyboard,TouchableWithoutFeedback} from 'react-native';
import MyView from './MyView'
import {Container,Header,Left,Right,Icon,Text,Body } from 'native-base';
import firebase  from 'firebase';
import { TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import * as Animatable from 'react-native-animatable';
import Statistics from './components/OwnerScreens/Statistics';
import Ads from './components/OwnerScreens/Ads';

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
const widthButton=width*0.8

class OwnersScreen extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
        statistics:false,
        ads:false,
    }}
    moveToStatistics(){
      this.setState({statistics:true})
  }
  moveToAds(){
    this.setState({ads:true})
}


  render() {

   
      return (
        <Animatable.View style={{paddingTop:'5%'},styles.footer}animation="fadeInDown">
          <View style={{position:'absolute'}}>
            <Text style={styles.title}>Welcome!</Text>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate(Ads)} style={styles.button}><Text style={styles.btnText}>See the advertising possibilities of your Parking</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate(Statistics)} style={styles.button}><Text style={styles.btnText}>See the statistics of your parking</Text></TouchableOpacity>
      
          </View>
          </Animatable.View>
    );
    
    
   
   
    
  
    
    
  }
}// End of MyHomeScreen class
export default OwnersScreen;

const styles=StyleSheet.create({
  title:{
    paddingTop:'10%',
    paddingLeft:'10%',
    alignItems:'center',
    color:'#0E9FFF',
    fontSize:30,
    fontWeight:'bold',
    alignSelf:'center'
  },
  button: {
    marginLeft:'10%',
    width: widthButton,
   marginTop:'30%',
    backgroundColor: "#545BE1",
    padding: '10%',
    borderRadius: 50,
  },
  btnText: {
    
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: '5%',
    paddingVertical: '5%'
},

})