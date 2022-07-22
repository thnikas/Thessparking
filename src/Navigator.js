import React, { Component } from 'react';
import {View,Text ,ScrollView} from 'react-native';
import {Container} from 'native-base';
import OwnersScreen from './OwnersScreen';
import Statistics from './components/OwnerScreens/Statistics';
import Ads from './components/OwnerScreens/Ads';
import { createStackNavigator } from '@react-navigation/stack';
import Linegraph from './components/graphs/Linegraph';
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator  screenOptions={{headerShown: false}}>
      <Stack.Screen   key="Owner" name="Owner" component={OwnersScreen} />
      <Stack.Screen name="Ads" key="Ads" component={Ads} />
      <Stack.Screen name="Statistics" key="Statistics" component={Linegraph} />
    </Stack.Navigator>
  );
}
class Navigator extends React.Component{
   render(){
    
      return(
            
            <MyStack/>
        
     );
   }
}

export default (Navigator);
