import React, { Component,PureComponent } from 'react';
import {StyleSheet,ActivityIndicator,BackHandler, Alert,View,Dimensions,ScrollView,Image,Button,Touchable,TouchableOpacity,TouchableHighlight,TextInput,SafeAreaView,Animated,Keyboard,TouchableWithoutFeedback} from 'react-native';
import MyView from './MyView'
import {Container,Header,Left,Right,Icon,Text,Body } from 'native-base';
import firebase  from 'firebase';
import * as Animatable from 'react-native-animatable';
import { ListItem,Rating } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; 




let favouritePark=[]//array that will show the favourite parkings
const { width, height } = Dimensions.get('window');
_isMounted=false//used so that mounted error do not shows

class OwnersScreen extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
        data:[],//array that will be passed the parking data
        users:[],//array that will be passed the users data
        loaded:false//when false show loader
    }
    this.findFavourite= this.findFavourite.bind(this);

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
        this.findFavourite()
      })
}
    findFavourite(){//find favourite parkings of the user
        let user = firebase.auth().currentUser;//to get current user that is logged in
        this.state.users.map((index,key)=>{
            if(user!==null){
                const email=user.email
                let counter=0
                if(index.email==user.email){
                    for(let i=0;i<index.favouriteParking.length;i++){
                        if(counter!==index.favouriteParking.length){
                            favouritePark.push(index.favouriteParking[i])
                            counter=counter+1
                        }
                        if(favouritePark.length==index.favouriteParking.length){//if length of the array is equal with the length of the array that exists if the database show favourite 
                            this.setState({loaded:true})
                            break;
                        }
        
                    }                   
                }
            }
            
        })
        
    }
    showPrice=(marker)=>{//show the Prices
        if(marker.Price==0||marker.Price==null){
          return null
        }
        else if(marker.Price>0&&marker.Price<=2){
          return(
            <View style={{paddingTop:'5%'}}>
              <Text>
              <Text>Price: </Text>
              <Text style={{color:'#10A524'}}>€</Text>
              </Text>
              </View>)
        }
        else if(marker.Price>2&&marker.Price<=3){
          return(
            <View style={{paddingTop:'5%'}}>
              <Text>
              <Text >Price: </Text>
              <Text style={{color:'#D9DF18'}}>€€</Text>
              </Text>
              
              </View>)
        }
        else if(marker.Price>3){
          return(
            <View style={{paddingTop:'5%'}}>
              <Text>
              <Text>Price: </Text>
              <Text style={{color:'#EE1D1D'}}>€€€</Text>
              </Text>
              </View>)
        }
        else {
          return(null)
        }
        
      
      
      }
        showFavourite(){//function that show the favourite parkings
            const results=[]
            {this.state.data.map((marker,index)=>{
                for(let i=0;i<favouritePark.length;i++){
                    if(favouritePark[i]==marker.Name){
                        results.push( <ListItem key={index} bottomDivider style={{paddingTop:'10%'}}  Component={TouchableScale} 
                        friction={90} //
                        tension={100} // These props are passed to the parent component (here TouchableScale)
                        activeScale={0.95} //
                      >
                        
                          <ListItem.Content >
                            <Text style={{fontWeight:'bold'}}>Name:{' '}{marker.Name}</Text>
                            {this.showPrice(marker)}
                            <Text style={{paddingTop:'5%'}}>Rating: <Rating  fractions={1} startingValue={marker.Rating}    readonly={true} imageSize={0.05*width} ratingCount={5} /></Text>
                            <Text style={{paddingTop:'5%'}}>Address:{' '}{marker.Address}</Text>
                            <Text style={{paddingTop:'5%'}}>Phone:{' '}{marker.Phone}</Text>
            
                          
                          </ListItem.Content>
                        </ListItem>)
                        
                    }
                }
            })}
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
                <Text style={styles.title}>Favourite Parking</Text>
                
              </View>
              <ScrollView  showsVerticalScrollIndicator={false} style={{paddingTop:'15%'}}>
                {this.showFavourite()}
               
              
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