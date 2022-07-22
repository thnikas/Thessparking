import React, { Component } from 'react';
import {View,Text ,ScrollView,StyleSheet,ActivityIndicator,Image} from 'react-native';
import GoogleMapScreen from './src/GoogleMapScreen';
import { createDrawerNavigator,DrawerItem,DrawerContentScrollView,DrawerItemList, } from '@react-navigation/drawer';
import RegisterScreen from './src/components/auth/RegisterNav'
import LoginScreen from './src/components/auth/LoginNav'
import firebase from 'firebase'
import rootReducer from './src/redux/reducers'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Navigator from './src/Navigator'
import Favourites from './src/Favourites'
import Reservation from './src/Reservation'
_isMounted=false//used so that mounted error do not shows
console.disableYellowBox = true;
const Stack = createStackNavigator();
const store=createStore(rootReducer, applyMiddleware(thunk))
const user = firebase.auth().currentUser;//to get current user that is logged in
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  
  return( <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />


    <DrawerItem label="Log out" onPress={() => firebase.auth().signOut()}  icon={({ focused, color, size }) => (
      <Material name="exit-run" color="#545BE1"size={25}/>

)}/>

  </DrawerContentScrollView>)


}
function LoginDrawer(){//when user login and is not Owner
return(
  
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} >
     
  <Drawer.Screen name="GoogleMaps" component={GoogleMapScreen}  
  options={{drawerIcon: ({ tintColor }) => 
  (<Foundation name="map" color="#545BE1" size={25}/>),}}/>
  
  
   <Drawer.Screen name="Log in" component={LoginScreen} 
    options={{drawerIcon: ({ tintColor }) => 
    (<Ionicons name="ios-enter" color="#545BE1"size={25}/>),}}/>

   {(props) =><Drawer.Screen name="Register" component={RegisterScreen} {...props}
   options={{drawerIcon: ({ tintColor }) => 
   (<AntDesign name="adduser" color="#545BE1" size={25}/>),}}/>}
   
   <Drawer.Screen name="Favourites" component={Favourites} 
          options={{drawerIcon: ({ tintColor }) => 
          (<AntDesign name='staro' color="#545BE1"size={25}/>),}}/>
    <Drawer.Screen name="Reservations" component={Reservation} 
          options={{drawerIcon: ({ tintColor }) => 
          (<EvilIcons name='calendar' color="#545BE1"size={25}/>),}}/>
  </Drawer.Navigator>
    
      
          
)

}
function RegisterDrawer(){//when user is not logged in
  return(
  <Drawer.Navigator >
    <Drawer.Screen name="Login" component={LoginScreen} 
    options={{drawerIcon: ({ tintColor }) => 
    (<Ionicons name="ios-enter" color="#545BE1"size={25}/>),}}/>

    <Drawer.Screen name="Register" component={RegisterScreen} 
    options={{drawerIcon: ({ tintColor }) => 
    (<AntDesign name="adduser" color="#545BE1" size={25}/>),}}/>
    
    <Drawer.Screen name="GoogleMaps" component={GoogleMapScreen} 
    options={{drawerIcon: ({ tintColor }) => 
    (<Foundation name="map" color="#545BE1" size={25}/>),}}/>

  </Drawer.Navigator>)
}

 
function LoginOwnerDrawer(){//when user login and is Owner
  
  return(
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} >

        <Drawer.Screen name='Owner' component={Navigator}options={{drawerIcon: ({ tintColor }) => 
        (<AntDesign name="linechart" color="#545BE1" size={25}/>),}}/>

        <Drawer.Screen name="GoogleMaps" component={GoogleMapScreen} 
        options={{drawerIcon: ({ tintColor }) => 
        (<Foundation name="map" color="#545BE1" size={25}/>),}}/>
        
         <Drawer.Screen name="Login" component={LoginScreen} 
          options={{drawerIcon: ({ tintColor }) => 
          (<Ionicons name="ios-enter" color="#545BE1"size={25}/>),}}/>

         {(props) =><Drawer.Screen name="Register" component={RegisterScreen} {...props}
         options={{drawerIcon: ({ tintColor }) => 
         (<AntDesign name="adduser" color="#545BE1" size={25}/>),}}/>}
          
          <Drawer.Screen name="Favourites" component={Favourites} 
          options={{drawerIcon: ({ tintColor }) => 
          (<AntDesign name='staro' color="#545BE1"size={25}/>),}}/>

          <Drawer.Screen name="Reservations" component={Reservation} 
          options={{drawerIcon: ({ tintColor }) => 
          (<EvilIcons name='calendar' color="#545BE1"size={25}/>),}}/>
        </Drawer.Navigator>
            
  )
  
}
 


class App extends React.Component{

  constructor(props){
    super(props)
  

    this.state={
        
        userLogged:false,
        loaded:false,
        isLoading: true,//used so that mounted error do not shows
        users:[],
        Owner:null//used to render the right screen
    }
    
    
}


setOnlyUser(){//used to show user screen
  firebase.firestore().collection("users").get().then(docs=>{
    docs.forEach(doc=>{
      const user = firebase.auth().currentUser;//to get current user that is logged in
      if(user!==null){
       if(doc.data()['email']==user.email&&doc.data()['isOwner']==false){
         this.setState({Owner:false})
       }
      }
    })
  })
}

setTypeUser(){//used to show owner screen
  
  firebase.firestore().collection("users").get().then(docs=>{//get collection of user data and passes to users array
    let users=[]
    docs.forEach(doc=>{
      users.push(doc.data())
     const user = firebase.auth().currentUser;//to get current user that is logged in
     if(user!==null){
      if(doc.data()['email']==user.email&&doc.data()['isOwner']==true){
        this.setState({Owner:true})
      }
     }
      
      
    })
    this.setState({users})
  })
}
componentDidUpdate(prevProps) {
}
componentWillUnmount() {
  this._isMounted = false;

}


 componentDidMount(){
  this.setTypeUser()
  this.setOnlyUser()
  this._isMounted=true
  firebase.auth().onAuthStateChanged((user) => {
    if (this._isMounted) {//used so that mounted error do not shows
      if(user!==null){
        this.setTypeUser()
        this.setOnlyUser()
      }
        this.setState({isLoading:false});
            
    }
      if(!user){
          this.setState({
            loggedIn:false,
            loaded:true,
          })
        }else{
          
          this.setState({
            loggedIn:true,
            loaded:true,
            })
          }
    })
}

render(){
  const{loggedIn,loaded}=this.state
  if(!loaded){
    
      return(
        <View style={[styles.container, styles.horizontal]} >
        <Image style={styles.image} source={require('./src/icons/parkingIcon.png')} />
        <Text style={styles.title}>ThessParking</Text>
          <ActivityIndicator size="large" color='#545BE1' style={{paddingTop:'60%'}}/>
          
        </View> 
                      
              )
  } if(!loggedIn){
      return (
        <NavigationContainer>
        <RegisterDrawer/>
        </NavigationContainer>
     )
    }if(this.state.Owner==true){
      return(
            
        <NavigationContainer>
        <LoginOwnerDrawer/>
        </NavigationContainer>

    )
    }if(this.state.Owner==false){
      return(
        <NavigationContainer >
          <LoginDrawer/>
        </NavigationContainer>

      )
    }else{
      return(
        <View style={[styles.container, styles.horizontal]} >
            <ActivityIndicator size="large" color='#545BE1' />
          </View> 
                    
            )
    }
      
    
   
    
}
}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {paddingTop:'20%',
    justifyContent: "space-around",
    padding: 10
  },
  title:{
    fontWeight:'bold',
    fontFamily:'sans-serif-medium',
    alignContent:'center',
    alignSelf:'center',
    fontSize:50,color:'#545BE1',
    alignItems:'center',
    paddingTop:'50%',
    position:'absolute'},
    image:{
      position:'absolute',
      alignItems:'center',
      alignSelf:'center',
      bottom:'60%'
    },
}
);
