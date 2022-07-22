import React, { Component} from 'react';
import {View,StyleSheet,TextInput,StatusBar,Image,Dimensions} from 'react-native';
import ParkingIcon from 'react-native-vector-icons/FontAwesome5'

import {ListItem} from 'react-native-elements'
import  firebase from 'firebase'
import { TouchableOpacity } from 'react-native';
import GoogleMapScreen from '../GoogleMapScreen';


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
  
  
  
  const { width, height } = Dimensions.get('window');
  const datacollection=firebase.firestore().collection("data")
  const db = firebase.firestore()
  const newdb=db.collection('data').doc();
  
  
    const setUser=()=>{
      const batch=db.batch()
    array.forEach((doc) => {
      var docRef = db.collection("data").doc(); //automatically generate unique id
      batch.set(docRef, doc);
    });
    batch.commit()
    }
    export default class SearchBar extends Component {
   
      
      constructor(props) {
        super(props);
        
        this.state={
          

          users:[],
          data:[],
          name:[[]
            
            
          ],
          isHidden: false,
          activeIndex:0,
          searchBarFocused: false,
          parkingFilter:[]
        }
        this.subscriber=firebase.firestore().collection("data").onSnapshot(docs=>{
          let data=[]
          docs.forEach(doc=>{
            data.push(doc.data())
          })
          this.setState({data})
          
        })
        
       }
       
      
       handlerSimpleCall = (marker) => {
        //Calling a function of other class (without arguments)
        new GoogleMapScreen().functionWithoutArg(marker);
        this.setState({
          parkingFilter:[]
        })
      };
       
       searchParking(textToSearch){
         
        this.setState({
          parkingFilter:this.state.data.filter(i=>i.Name.toLowerCase().includes(textToSearch.toLowerCase()))
        })
        if(textToSearch==''){
          this.setState({
            parkingFilter:[]
          })
        }
      }
      
    
    render() {
      
      
      return (
        
        <View style={{position:'absolute',marginTop:'15%'}}>
        <View style={styles.searchBox}>
           <TextInput placeholder="Find Parking" onChangeText={text=>{this.searchParking(text)}} 
           placeholderTextColor="#000"
           autoCapitalize="none"
           textAlign="left"
           
           style={{flex:1,padding:0}}/>
           <ParkingIcon name="search-location" style={{paddingTop:'0.5%'}} backgroundColor="#545BE1" color="#545BE1"  size={30}/>
           </View>
           
        
         <View style={{position:'absolute',marginTop:'8%',width:'150%',height:'150%',paddingLeft:'30%',paddingTop:'10%'}}>
           
         {this.state.parkingFilter.map((marker,index)=>(
      
         <ListItem 
         
         onPress={() =>{this.handlerSimpleCall(marker)}} key={index}  style={{width:'200%',height:'170%',backgroundColor:'white',elevation:10, borderRadius: 5,paddingTop:'10%',alignContent:'center'}}>
         
         <ListItem.Content>
           <ListItem.Title style={{position:'absolute',alignContent:'center',alignItems:'center',alignSelf:'center'}}>{marker.Name}</ListItem.Title>
          
         </ListItem.Content>
       </ListItem>
          
       
          
           
              
           ))}
         </View>
         </View>
        
       );
      }
    }

const styles = StyleSheet.create({
    //searchBar
    searchBox: {
      flex:1,
      paddingLeft:'10%',
      flexDirection:'row',
      backgroundColor: '#fff',
      width: '300%',
      height:'5%',
      marginLeft:'10%',
      borderRadius: 5,
      padding: 5,
      marginTop:'-15%',
      shadowColor: '#ccc',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 10,
    },
     
     container: {
       flex: 1,
       
     },
   
   });
