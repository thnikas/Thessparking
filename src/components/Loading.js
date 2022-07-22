import React, { Component } from 'react'
import { View, Button, TextInput,Text,StyleSheet,ActivityIndicator,ScrollView } from 'react-native'
import {Provider} from 'react-redux'
import firebase from 'firebase'
import { createAppContainer, NavigationEvents, SafeAreaView } from 'react-navigation'
import {createDrawerNavigator,DrawerItems} from 'react-navigation-drawer'
import LoginScreen from './auth/Login'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';
import RegisterScreen from './auth/Register'
import MapTestScreen from '../MapTest'
import GoogleScreen from '../GoogleMapScreen'
import rootReducer from '../redux/reducers'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
//const user = firebase.auth().currentUser;
const Stack = createStackNavigator();
const store=createStore(rootReducer, applyMiddleware(thunk))


  //const MyApp = createAppContainer(MyDrawerNavigator);
class Loading extends React.Component{
    constructor(props){
        super(props)
      

        this.state={
            userLogged:false,
            loaded:false,
        }
    }
    
   


    componentDidMount(){

        firebase.auth().onAuthStateChanged(user => {
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
                <ActivityIndicator size="large" color='#545BE1' />
                    
              </View>           
                    )
        } if(!loggedIn){
            return (
              <NavigationContainer>
                <Stack.Navigator 
                screenOptions={{headerShown: false}}>
                
                  <Stack.Screen name="Register" component={RegisterScreen} />
                
                </Stack.Navigator>
            </NavigationContainer> 
           )
          }
          return(
            <Provider store={store}> 
              <NavigationContainer>
              <Stack.Navigator initialRouteName="Login"  screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login" component={LoginScreen}/>
                </Stack.Navigator>
              </NavigationContainer>
            
                  
            </Provider>
          )
          
    }
}
export default Loading
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    }
  });