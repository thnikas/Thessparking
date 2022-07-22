import React, { Component,PureComponent } from 'react';
import {StyleSheet,ActivityIndicator,BackHandler, Alert,View,Dimensions,ScrollView,Image,Button,Touchable,TouchableOpacity,TouchableHighlight,TextInput,SafeAreaView,Animated,Keyboard,TouchableWithoutFeedback} from 'react-native';
import MyView from './MyView'
import {Container,Header,Left,Right,Icon,Text,Body } from 'native-base';
import firebase  from 'firebase';
import * as Animatable from 'react-native-animatable';
import { ListItem,Rating } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale




let showValues=[]//array that will show the favourite parkings
const { width, height } = Dimensions.get('window');
_isMounted=false//used so that mounted error do not shows

class OwnersScreen extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
        data:[],//array that will be passed the parking data
        users:[],//array that will be passed the users data
        reservation:[],
        loaded:false//when false show loader
    }
    this.findReservation= this.findReservation.bind(this);

    this.subscriber=firebase.firestore().collection("data").onSnapshot(docs=>{
        let data=[]
        docs.forEach(doc=>{
          data.push(doc.data())
        })
        this.setState({data})
      })
      this.subscriber=firebase.firestore().collection("users").onSnapshot(docs=>{//get collection of user data and passes to users array
        let users=[]
        docs.forEach(doc=>{
          users.push(doc.data())
        })
        this.setState({users})
      })
      this.subscriber=firebase.firestore().collection("reservations").onSnapshot(docs=>{//get collection of user data and passes to users array
        let reservation=[]
        docs.forEach(doc=>{
          reservation.push(doc.data())
        })
        this.setState({reservation})
        this.findReservation()
      })
}
    findReservation(){//find favourite parkings of the user
        let user = firebase.auth().currentUser;//to get current user that is logged in
        this.state.reservation.map((index,key)=>{
            if(user!==null){
                const email=user.email
                let counter=0
                if(index.email==user.email){
                  console.log('enter')
                  showValues.push(index)                   
                }
            }
            
        })
        this.setState({loaded:true})
    }
    
      showReservation(){//function that show the reservations
            const results=[]
            {this.state.reservation.map((marker,index)=>{
               
                        results.push( <ListItem key={index} bottomDivider style={{paddingTop:'10%'}}  Component={TouchableScale} 
                        friction={90} //
                        tension={100} // These props are passed to the parent component (here TouchableScale)
                        activeScale={0.95} //
                      >
                        
                          <ListItem.Content >
                            <Text ><Text style={{fontWeight:'bold'}}>Parking Name:{' '}</Text><Text style={{color:'#545BE1',fontWeight:'bold'}}>{marker.parking}</Text></Text>
                            <Text ><Text style={{fontWeight:'bold'}}>Date:{' '}</Text><Text style={{color:'#545BE1',fontWeight:'bold'}}>{marker.date}</Text></Text>
                            <Text ><Text style={{fontWeight:'bold'}}>Time:{' '}</Text><Text style={{color:'#545BE1',fontWeight:'bold'}}>{marker.hour}</Text></Text>
                            

            
                          
                          </ListItem.Content>
                        </ListItem>)
                        
                 
            })}
            console.log(results)
            return results//results show all the items that must be shown in the scroll view

           
        }
        
      

  render() {
        const{loggedIn,loaded}=this.state

      if(loaded==false){//show loader

          return(<View style={[styles.container, styles.horizontal]} >
            <ActivityIndicator size="large" color='#545BE1' />
          </View> )
        
      }else{
        return (
            <Animatable.View style={{paddingTop:'5%'},styles.footer}animation="fadeInDown">
              <View style={{position:'absolute'}}>
                <Text style={styles.title}>Your reservations</Text>
                
              </View>
              <ScrollView  showsVerticalScrollIndicator={false} style={{paddingTop:'15%'}}>
                {this.showReservation()}

              </ScrollView>
            </Animatable.View>
        );
      }
   
       
    
    
    
   
   
    
  /*                            

   */
    
    
  }
}// End of MyHomeScreen class
export default OwnersScreen;

const styles=StyleSheet.create({
    title:{
      paddingTop:'10%',
      paddingLeft:'16%',
      alignItems:'center',
      color:'#0E9FFF',
      fontSize:30,
      fontWeight:'bold',
      alignSelf:'center'
    },
    footer: {
      flex: Platform.OS === 'ios' ? 3 : 5,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: '5%',
      paddingVertical: '5%'
  }, container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
  })