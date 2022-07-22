import React, { Component,PureComponent } from 'react';
import {Alert,Switch,StyleSheet,View,Dimensions,ScrollView,Image,Button,Touchable,TouchableOpacity,TouchableHighlight,TextInput,SafeAreaView,Animated,Keyboard,TouchableWithoutFeedback,PanResponder} from 'react-native';
import MyView from './MyView'
import {Container,Header,Left,Right,Icon,Text,Body, List } from 'native-base';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import ParkingIcon from 'react-native-vector-icons/FontAwesome5'
import Direction from 'react-native-vector-icons/Fontisto'
import InfoIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from 'firebase'
import MapViewDirections from 'react-native-maps-directions'
import { Rating,ListItem} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment'
import RNLocation from 'react-native-location';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import * as Animatable from 'react-native-animatable';
import Accordian from './components/Accordian';
import DatePicker from './components/DatePicker';
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
  RNLocation.configure({
    distanceFilter: null
   }) 
   

const { width, height } = Dimensions.get('window');
let CARD_HEIGHT = height / 6;
const CARD_WIDTH = CARD_HEIGHT + 100;
const ASPECT_RATIO = width / height;
const LATITUDE = 40.629269;
const LONGITUDE = 22.947412;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let today=moment().format('D M YYYY')
var mapstyle=require('./constants/mapstyle.json');//Google_map_style
let user = firebase.auth().currentUser;//to get current user that is logged in
let currentRating=null//used to change the rating of parkings
let userLocationLat=null//user location
let userLocationLon=null//user location
function getArrayMax(array){//max needed to categorized parkings
  return Math.max.apply(null, array);
}
function getArrayMin(array){//min needed to categorized parkings
  return Math.min.apply(null,array)
}

class GoogleMapScreen extends React.Component {
  constructor(props){
    super(props)
    this.myRef = React.createRef();//ref for marker show that change title on scroll can work
    
    this.state={
      origin:null,//used in directions
      destination:null,//used in directions
      showWay:true,//if true show the direction from user to parking
      enable:false,//enable true when switch for categorized parkings is enable
      enableToumba:false,//enable switch Toumba
      enableXarilaou:false,//enable switch
      enableKentro:false,//enable switch Kentro
      enableLowPrice:false,//enable switch LowPrices
      enableHighPrice:false,//enable switch HighPrices
      frequent:[],//array used in function that shows statistics in ownerscreen
      currentRate:this.currentRating,//current rating of the parking
      isLoading: true,//used so that mounted error do not shows
      canNotRate:true,//used if the user is not logged in so he ca not rate
      users:[],//used to save the users data inside this array
      CardStyle:styles.card1,//used to change the card style when user presses the i button
      animateCardH: new Animated.Value(CARD_HEIGHT),//set height for the card so that changes when the button is pressed
      animateCardW: new Animated.Value(CARD_WIDTH),//set width for the card so that changes when the button is pressed
      activeCard:false,//when true the card is become bigger
      keyboardStatus: undefined,//used for se searchBar
      searchBarFocused: false,//true when searchBar is pressed
      parkingFilter:[],//array for the search bar
      isHidden:true,//used to hide/show cards
      showtitle:'',//shows the title that is pressed 
      cardName:'',//the cardName that displays on the card
      cardLatitude:0,//used show that when the user pressed on a marker the region changed to lock on the marker
      cardLongitude:0,//used show that when the user pressed on a marker the region changed to lock on the marker
      data:[],
      defaultData:[],
      region: {
        latitude: 40.629269,
        longitude: 22.947412,
        latitudeDelta:  0.0922,
        longitudeDelta: 0.0922*ASPECT_RATIO,
      },
      bestParkings:[],//top 10 best parkings for categorized
      parkingPrice:[],//top 10 best parkings for categorized
      parkingDistance:[],//top 10 best parkings for categorized
      greenParkings:[],//top 5  parkings for categorized green
      greenPrice:[],//top 5  parkings for categorized green
      greenDistance:[],//top 5  parkings for categorized green
      orangeParkings:[],//the other 5  parkings for categorized orange
      orangePrice:[],//the other 5  parkings for categorized orange
      orangeDistance:[],//the other 5  parkings for categorized orange
      markerColor:"#545BE1",
      hideFilters:true,//hide show scrollview that shows filters
      hideSearch:true,//show hide searchbar
      arrayRegion:[],//equal to data, used to filter data
      showCalendar:false//show hide calendar
    }

    
    this.subscriber=firebase.firestore().collection("data").onSnapshot(docs=>{
      let data=[]
      const checkUser = async () => {

        let location= await RNLocation.getLatestLocation({timeout: 100})//user location
         if(location!==null){//get user location to show parkings that are close to the user
           userLocationLat=location.latitude
           userLocationLon=location.longitude
         }
          
         
       }
       {checkUser()}

      docs.forEach(doc=>{
        let distance=this.getDistanceFromLatLonInKm(userLocationLat,userLocationLon,doc.data().Latitude,doc.data().Longitude)//get distance from parking to user
        if(distance<=3){
          data.push(doc.data())

        }else if(userLocationLat==null){
          data.push(doc.data())

        }
        

        })
      this.setState({data})
    })
    this.subscriber=firebase.firestore().collection("data").onSnapshot(docs=>{
      let arrayRegion=[]
      
      docs.forEach(doc=>{
        arrayRegion.push(doc.data())
      })
      this.setState({arrayRegion})
    })
    this.index = 0;
    this.animation = new Animated.Value(0);//used for the animation of the card
    
    this.subscriber=firebase.firestore().collection("users").onSnapshot(docs=>{//get collection of user data and passes to users array
      let users=[]
      docs.forEach(doc=>{
        users.push(doc.data())
      })
      this.setState({users})
    })
    this.subscriber=firebase.firestore().collection("frequent").onSnapshot(docs=>{//get collection of user data and passes to users array
      let frequent=[]
      docs.forEach(doc=>{
        frequent.push(doc.data())
      })
      this.setState({frequent})
    })
  
  }



 onRegionChangeComplete = () => {//used to show the map title with the use of Ref
   
    if (this.myRef && this.myRef.current && this.myRef.current.showCallout ) {
      this.myRef.current.showCallout();
      
    }
  };
 
   permissionHandle = async (marker) => {//when user has not enable his gps and presses direction this shows


  
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse' // or 'fine'
      }
    });
    permission = await RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse",
        rationale: {
          title: "We need to access your location",
          message: "We use your location to show where you are on the map",
          buttonPositive: "OK",
          buttonNegative: "Cancel"
        }
      }
    })
    let location;
  
  if(!permission) {
      permission = await RNLocation.requestPermission({
         ios: "whenInUse",
         android: {
           detail: "coarse",
           rationale: {
             title: "We need to access your location",
             message: "We use your location to show where you are on the map",
             buttonPositive: "OK",
             buttonNegative: "Cancel"
           }
         }
       })
       location = await RNLocation.getLatestLocation({timeout: 100})
       this.showdirections(marker,location)
  } else {
      location = await RNLocation.getLatestLocation({timeout: 100})
      this.showdirections(marker,location)

  }
  if(location==null){
    this.setState({showWay:true})
    Alert.alert('','Please enable location information')
  }
  }
   getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {//get distance from point to point
    
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
   deg2rad(deg) {//function used above
    return deg * (Math.PI/180)
  }
   
  categorizeParkings(){//fynction to categorize parkings
    let maxDistance=0
    
    const checkUser = async () => {

     let location= await RNLocation.getLatestLocation({timeout: 100})//user location
      if(location!==null){
        userLocationLat=location.latitude
        userLocationLon=location.longitude
      }
       
      
    }
    {checkUser()}
    if(userLocationLat==null){

      Alert.alert('','Please enable location information')
      return(null)
    }
    this.state.data.map((marker,index)=>{
      let distance=this.getDistanceFromLatLonInKm(userLocationLat,userLocationLon,marker.Latitude,marker.Longitude)//get distance from parking to user
      distance=distance.toFixed(1)//set number to 1 digit
      let temp=false//used so that do not exists doudle parking values in the arrays 
      maxDistance=getArrayMax(this.state.parkingDistance)//get the max distance from the array
      if(this.state.bestParkings.length<10){//get the 10 best parkings
        this.state.bestParkings.push(marker.Name)
        this.state.parkingPrice.push(marker.Price)
        this.state.parkingDistance.push(distance)
       
      }else if(this.state.bestParkings.length>=10){
        for(i=0;i<this.state.bestParkings.length;i++){//check for double values
          if(this.state.bestParkings[i]==marker.Name){
            temp=false
            break;
          }else{
            temp=true
            
          }
        }
        if(distance<maxDistance){//if this distance is less than the maxDistance of the array
          for(i=0;i<this.state.bestParkings.length;i++){
          
          
            if(this.state.parkingDistance[i]==maxDistance &&temp==true){//used to find in which i is the maxDistance
              this.state.parkingDistance[i]=distance
              this.state.bestParkings[i]=marker.Name
              this.state.parkingPrice[i]=marker.Price
              break;

            }
          }
        }else if(distance==maxDistance){//if equal take parking based on the price
          for(i=0;i<this.state.bestParkings.length;i++){
            if(this.state.parkingDistance[i]==maxDistance&&temp==true &&marker.Price!==0){
              if(this.state.parkingPrice[i]>marker.Price){
                this.state.parkingDistance[i]=distance
                this.state.bestParkings[i]=marker.Name
                this.state.parkingPrice[i]=marker.Price
                break;
              }
            }
          }
        }
      }
    })
    for(let i=0;i<this.state.bestParkings.length;i++){//categorized green parkings 
     
      let temp=false
      maxDistance=getArrayMax(this.state.greenDistance)
      if(this.state.greenParkings.length<5){
        this.state.greenParkings.push(this.state.bestParkings[i])
        this.state.greenDistance.push(this.state.parkingDistance[i])
        this.state.greenPrice.push(this.state.parkingPrice[i])
      }else if(this.state.bestParkings.length>=5){
        for(j=0;j<this.state.greenParkings.length;j++){
          if(this.state.greenParkings[j]==this.state.bestParkings[i]){
            temp=false
            break;
          }else{
            temp=true
            
          }
        }
        if(this.state.parkingDistance[i]<maxDistance){
          for(let j=0;j<this.state.greenParkings.length;j++){
            if(this.state.greenDistance[j]==maxDistance&&temp==true){
              this.state.greenParkings[j]=this.state.bestParkings[i]
              this.state.greenDistance[j]=this.state.parkingDistance[i]
              this.state.greenPrice[j]=this.state.parkingPrice[i]
              break;
            }
          }
        }else if(this.state.parkingDistance[i]==maxDistance){
          for(let j=0;j<this.state.greenParkings.length;j++){

            if((this.state.greenDistance[j]==maxDistance&&temp==true )){
              let tempParking=this.state.greenParkings[j]
              let tempDistance=this.state.greenDistance[j]
              let tempPrice=this.state.greenPrice[j]
              
              for(let z=0;z<this.state.greenParkings.length;z++){
                
                if(tempDistance==this.state.greenDistance[z]&&tempParking!==this.state.greenParkings[z]&&tempPrice<this.state.greenPrice[z]){
                  this.state.greenParkings[z]=this.state.bestParkings[i]
                  this.state.greenDistance[z]=this.state.parkingDistance[i]
                  this.state.greenPrice[z]=this.state.parkingPrice[i]
                  break;
                }
              }
              if(this.state.greenPrice[j]>this.state.parkingPrice[i]){
                this.state.greenParkings[j]=this.state.bestParkings[i]
              this.state.greenDistance[j]=this.state.parkingDistance[i]
              this.state.greenPrice[j]=this.state.parkingPrice[i]
              break;
              }
              break
            }
          }
        }
      }   
    }for(let i=0;i<this.state.bestParkings.length;i++){//categorize orange parkings
      let temp=false
      let minDistance=getArrayMin(this.state.orangeDistance)
      if(this.state.orangeParkings.length<5){
        this.state.orangeParkings.push(this.state.bestParkings[i])
        this.state.orangeDistance.push(this.state.parkingDistance[i])
        this.state.orangePrice.push(this.state.parkingPrice[i])
      }else if(this.state.bestParkings.length>=5){
        for(j=0;j<this.state.orangeParkings.length;j++){
          if(this.state.orangeParkings[j]==this.state.bestParkings[i]){
            temp=false
            break;
          }else{
            temp=true
            
          }
        }
        if(this.state.parkingDistance[i]>minDistance){
          for(let j=0;j<this.state.orangeParkings.length;j++){
            if(this.state.orangeDistance[j]==minDistance&&temp==true){
              this.state.orangeParkings[j]=this.state.bestParkings[i]
              this.state.orangeDistance[j]=this.state.parkingDistance[i]
              this.state.orangePrice[j]=this.state.parkingPrice[i]
              break;
            }
          }
        }else if(this.state.parkingDistance[i]==minDistance){
          for(let j=0;j<this.state.orangeParkings.length;j++){

            if((this.state.orangeDistance[j]==minDistance&&temp==true )){
              console.log(this.state.bestParkings[i])

              let tempParking=this.state.orangeParkings[j]
              let tempDistance=this.state.orangeDistance[j]
              let tempPrice=this.state.orangePrice[j]
              for(let z=0;z<this.state.orangeParkings.length;z++){
                if(tempDistance==this.state.orangeDistance[z]&&tempParking!==this.state.orangeParkings[z]&&tempPrice>=this.state.orangePrice[z]){
                  console.log('test111')

                  this.state.orangeParkings[z]=this.state.bestParkings[i]
              this.state.orangeDistance[z]=this.state.parkingDistance[i]
              this.state.orangePrice[z]=this.state.parkingPrice[i]
              break
                }
              } if(this.state.orangePrice[j]<=this.state.parkingPrice[i]){
                this.state.orangeParkings[j]=this.state.bestParkings[i]
              this.state.orangeDistance[j]=this.state.parkingDistance[i]
              this.state.orangePrice[j]=this.state.parkingPrice[i]
              
              break;
              }
              break
            }
          }
        }
      }   
    }
    
      console.log(this.state.bestParkings)
      console.log(this.state.parkingDistance)
    

      
  }
  showOnlyRegionT(){//called when switch Toumba is pressed

    if(this.state.enableToumba==false){
      if(this.state.enableHighPrice||this.state.enableLowPrice){
        this.setState({enableHighPrice:false})
        this.setState({enableLowPrice:false})
      }
      const array=this.state.arrayRegion.filter(obj=>obj.Region=='Τούμπα')
      if(this.state.enableXarilaou==true){
        const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Χαριλάου')

        if(this.state.enableKentro==true){
          const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
          const array3=[...array,...array1]
          const array4=[...array2,...array3]
          this.setState({data:array4})
        }else{
          const array3=[...array,...array2]
          this.setState({data:array3})
        }
   
      }else if(this.state.enableKentro==true){
        const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
        const array3=[...array,...array1]
        this.setState({data:array3})
      }else{
          this.setState({data:array})
        }
    }else if(this.state.enableKentro==false&&this.state.enableToumba==true&&this.state.enableXarilaou==false){
      this.setState({data:this.state.arrayRegion})
    }else if(this.state.enableKentro==true&&this.state.enableToumba==true){
      const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
      if(this.state.enableXarilaou==true){
        const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Χαριλάου')
        const array3=[...array2,...array1]
        this.setState({data:array3})
      }else{
        this.setState({data:array1})

      }
    }else if(this.state.enableKentro==false&&this.state.enableToumba==true&&this.state.enableXarilaou==true){
      const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Χαριλάου')
      this.setState({data:array2})

    }
  } 
  showOnlyRegionX(){//called when switch xarilou is pressed
    

    if(this.state.enableXarilaou==false){
      if(this.state.enableHighPrice||this.state.enableLowPrice){
        this.setState({enableHighPrice:false})
        this.setState({enableLowPrice:false})
      }
      const array=this.state.arrayRegion.filter(obj=>obj.Region=='Χαριλάου')
      if(this.state.enableToumba==true){
        const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Τούμπα')

        if(this.state.enableKentro==true){
          const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
          const array3=[...array,...array1]
          const array4=[...array2,...array3]
          this.setState({data:array4})
        }else{
          const array3=[...array,...array2]
          this.setState({data:array3})
        }
   
      }else if(this.state.enableKentro==true){
        const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
        const array3=[...array,...array1]
        this.setState({data:array3})
      }else{
          this.setState({data:array})
        }
    }else if(this.state.enableKentro==false&&this.state.enableToumba==false&&this.state.enableXarilaou==true){
      this.setState({data:this.state.arrayRegion})

    }else if(this.state.enableXarilaou==true&&this.state.enableToumba==true){
      const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Τούμπα')
      if(this.state.enableKentro==true){
        const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
        const array3=[...array2,...array1]
        this.setState({data:array3})
      }else{
        this.setState({data:array1})

      }
    }else if(this.state.enableXarilaou==true&&this.state.enableToumba==false&&this.state.enableKentro==true){
      const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
      this.setState({data:array2})

    }
  } 
  showOnlyRegionK(){//called when switch kentro is pressed

    if(this.state.enableKentro==false){
      if(this.state.enableHighPrice||this.state.enableLowPrice){
        this.setState({enableHighPrice:false})
        this.setState({enableLowPrice:false})
      }
      const array=this.state.arrayRegion.filter(obj=>obj.Region=='Κέντρο')
      if(this.state.enableXarilaou==true){
        const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Χαριλάου')

        if(this.state.enableToumba==true){
          const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Τούμπα')
          const array3=[...array,...array1]
          const array4=[...array2,...array3]
          this.setState({data:array4})
        }else{
          const array3=[...array,...array2]
          this.setState({data:array3})
        }
   
      }else if(this.state.enableToumba==true){
        const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Τούμπα')
        const array3=[...array,...array1]
        this.setState({data:array3})
      }else{
          this.setState({data:array})
        }
    }else if(this.state.enableKentro==true&&this.state.enableToumba==false&&this.state.enableXarilaou==false){
      this.setState({data:this.state.arrayRegion})

    }else if(this.state.enableKentro==true&&this.state.enableToumba==true){
      const array1=this.state.arrayRegion.filter(obj=>obj.Region=='Τούμπα')
      if(this.state.enableXarilaou==true){
        const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Χαριλάου')
        const array3=[...array2,...array1]
        this.setState({data:array3})
      }else{
        this.setState({data:array1})

      }
    }else if(this.state.enableKentro==true&&this.state.enableToumba==false&&this.state.enableXarilaou==true){
      const array2=this.state.arrayRegion.filter(obj=>obj.Region=='Χαριλάου')
      this.setState({data:array2})

    }
  }
  showOnlyLowPrice(){//called when switch LowPrice is pressed
    if(this.state.enableLowPrice==false){
      if(this.state.enableKentro||this.state.enableToumba||this.state.enableKentro){
        this.setState({enableKentro:false})
        this.setState({enableXarilaou:false})
        this.setState({enableToumba:false})
      }
      if(this.state.enableHighPrice==true){
        this.setState({enableHighPrice:false})

      }
        const array=this.state.arrayRegion.filter(obj=>obj.Price<=2)
        this.setState({data:array})
      
    }else{
      this.setState({data:this.state.arrayRegion})
    }
  }
  showOnlyHighPrice(){//called when switch HighPrice is pressed
    if(this.state.enableHighPrice==false){
      if(this.state.enableKentro||this.state.enableToumba||this.state.enableKentro){
        this.setState({enableKentro:false})
        this.setState({enableXarilaou:false})
        this.setState({enableToumba:false})
      }
      if(this.state.enableLowPrice==true){
        this.setState({enableLowPrice:false})

      }
        const array=this.state.arrayRegion.filter(obj=>obj.Price>2)
        this.setState({data:array})
      
    }else{
      this.setState({data:this.state.arrayRegion})
    }
  }
  componentWillUnmount() {

    
    this._isMounted = false;//used to avoid react state update error
  }
  componentDidMount() {
    this._isMounted=true//used to avoid react state update error
    
      firebase.auth().onAuthStateChanged((user) => {
        if (this._isMounted) {//used so that mounted error do not shows
          this.setState({isLoading: false})
          if (!user) {//used so that mounted error do not shows
            this.setState({canNotRate: true})
            
          }else{
            this.setState({canNotRate: false})
          }
        }
        
        })
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
      

  }



  dataMarkers= () => {//renders all data for parkings
    if(this.state.isHidden==true){
      
      this.state.defaultData=this.state.data//defaultData for the first render
      
    }  
  }
  showPrice=(marker)=>{//show the Prices
    if(marker.Price==0||marker.Price==null){
      return null
    }
    else if(marker.Price>0&&marker.Price<=2){
      return(
        <View style={{marginTop:'11%'}}>
          <Text>
          <Text style={{fontWeight:'bold'}}>Price: </Text>
          <Text style={{color:'#10A524'}}>€</Text>
          </Text>
          </View>)
    }
    else if(marker.Price>2&&marker.Price<=3){
      return(
        <View style={{marginTop:'11%'}}>
          <Text>
          <Text style={{fontWeight:'bold'}}>Price: </Text>
          <Text style={{color:'#D9DF18'}}>€€</Text>
          </Text>
          
          </View>)
    }
    else if(marker.Price>3){
      return(
        <View style={{marginTop:'11%'}}>
          <Text>
          <Text style={{fontWeight:'bold'}}>Price: </Text>
          <Text style={{color:'#EE1D1D'}}>€€€</Text>
          </Text>
          </View>)
    }
    else {
      return(null)
    }
    
  
  
  }

 markerClick=(marker)=>{//used when the user clicks on the marker
  

  async function saveFrequent(){//used to save when the user clicks on a parking to see the owner how many times has his parking clicked
    const parkingMarker= firebase.firestore().collection('data')
    const snapshot=await parkingMarker.where('Name','==',marker.Name).get()
    snapshot.forEach(doc => {
      const data = doc.data();
      const increment = firebase.firestore.FieldValue.increment(1);
      const temp=firebase.firestore().collection('frequent').doc(doc.id)
        
        temp.get().then(doc=>{
          if(doc.exists){
            let checkValues=false
            let value=doc.data()
            let counter=doc.data()
            let temp2=doc.data()['date']            
            value=value['date'][0]['value']
            counter=counter['date'][1]['counter']
            
           for(let i=0;i<value.length;i++){
             if(value[i]==today){
               let setCounter=counter[i]+1
               temp2[1].counter[i]=setCounter
               checkValues=true
             }
           }
           if(checkValues==false){
            temp2[0].value[value.length]=today
            temp2[1].counter[value.length]=1
          }                   
           firebase.firestore().collection('frequent').doc(doc.id).set({date:temp2},{merge:true})
          }else{            
            firebase.firestore().collection('frequent').doc(doc.id).set({date:[{value:[today]},{counter:[1]}]})
          }
        })
        

        

  })}
    saveFrequent()
    
  if(this.myRef!=={"current": null}){//used when the user scrolls on Scrollview and the press another parking the parking will be shown
    this.myRef.current={"current": null}
    {this.state.data.map((marker,index) => {  //maybe defaultData needed to be used 
     
      if(this.state.showtitle==marker.Name||this.state.searchBarFocused==true){
       return(
        <MapView.Marker onPress= {()=>this.markerClick(marker)}
          key={index}
          ref={this.myRef}
          coordinate={{ latitude: marker.Latitude, 
          longitude: marker.Longitude}}
            
          description={marker.Description}
          title={marker.Name} >
            
                        
        <ParkingIcon name="parking"   color={this.state.markerColor} size={30}/>
        
        </MapView.Marker>
     )
    }})}
     
  }
  
  this.onRegionChangeComplete()
  this.setState({isHidden:false})//used show-hide Scrollview
  this.setState({showtitle:marker.Name},()=>{
  
  })
  
  var temp = this.state.data.filter(x=> x.Name != marker.Name); //used show that the ScrollView cards change values
  temp.unshift(marker);  
  this.setState({data:temp});
    return this.state.data.map((marker,index) =>
    <MapView.Marker onPress= {()=>this.markerClick(marker)}
 
      key={index}
      coordinate={{ latitude: marker.Latitude, 
      longitude: marker.Longitude}}
        
      description={marker.Description}
      title={marker.Name}>
        
                    
      <ParkingIcon name="parking"  backgroundColor={this.state.markerColor}  color={this.state.markerColor}  size={30}/>
    
  </MapView.Marker >)
  }
  
  handlerSimpleCall = (marker) => {//function for keyboard
    Keyboard.dismiss()
    this.setState({
      parkingFilter:[]
    })
    this.markerClick(marker)
    
  };
  
  checkFavourite(marker){//used to check which parkings the user has added to favourites
    { this.state.users.map((index,key)=>{
                      
      if(user!==null){
       email = user.email;
       uid = user.uid;
       if(email==index.email){
         const results=[]
         if(index.favouriteParking==undefined){
          results.push(
            <View key={index}  style={{position:'absolute',paddingLeft:'82%',paddingTop:'15%'}}>
              <TouchableOpacity  onPress={()=>this.setFavourite(marker)}>
            <AntDesign name='staro' size={30} color="#05375a" />
            </TouchableOpacity>
            </View>
            
          )
         }else{
          for(let i=0;i<=index.favouriteParking.length;i++){
            if(index.favouriteParking[i]==marker.Name){
              results.push(
                <View style={{position:'absolute',paddingLeft:'82%',paddingTop:'15%'}}  key={i} >
                <TouchableOpacity onPress={()=>this.setFavourite(marker)}>
                <AntDesign name='star' size={30} color="#05375a" />
                </TouchableOpacity>
                </View>
                )
            }else{
              results.push(
                <View key={i}  style={{position:'absolute',paddingLeft:'82%',paddingTop:'15%'}}>
                <TouchableOpacity  onPress={()=>this.setFavourite(marker)}>
                <AntDesign name='staro' size={30} color="#05375a" />
                </TouchableOpacity>
                </View>
                
              )
             
            }
          }
         }
        
       return results
    
   }
  }})}}

  setFavourite(marker){//function that changes the database of user favourites parkings
    
     this.state.users.map((index,key)=>{
    
      if(user!==null){
        email = user.email;
        uid = user.uid;}
        if(email==index.email){


          async function saveFavourite(){
            const userEmail= firebase.firestore().collection('users')
            const snapshot=await userEmail.where('email','==',index.email).get()
            if (snapshot.empty) {
              return;
            } 
            
            snapshot.forEach(doc => {
            if(index.favouriteParking==undefined){
              userEmail.doc(doc.id).set({favouriteParking:([marker.Name])},{merge:true})

            }else{
              let countFavourites=index.favouriteParking.length
              if(countFavourites==0){
                userEmail.doc(doc.id).update({favouriteParking:firebase.firestore.FieldValue.arrayUnion(marker.Name)},{merge:true})
              }
              for(let i=0;i<countFavourites;i++){
                if(marker.Name==index.favouriteParking[i]){
                userEmail.doc(doc.id).update({favouriteParking:firebase.firestore.FieldValue.arrayRemove(marker.Name)},{merge:true})
              
            }else{
                userEmail.doc(doc.id).update({favouriteParking:firebase.firestore.FieldValue.arrayUnion(marker.Name)},{merge:true})
        
            }
          }
        }    
         
      });
    }
    saveFavourite()
    }
  })
      
    
  }

  startAnimation=(marker)=>{//animation to show bigger the card
    if(this.state.activeCard==false){

      this.setState({CardStyle:styles.card2})
      Animated.timing(this.state.animateCardH,{toValue:CARD_HEIGHT+300,duration:1000,useNativeDriver:false}).start()
      Animated.timing(this.state.animateCardW,{toValue: CARD_WIDTH+100,duration:1000,useNativeDriver:false}).start()
      this.setState({activeCard:true})
    }
    else if(this.state.activeCard==true){
      this.setState({CardStyle:styles.card1})
      Animated.timing(this.state.animateCardH,{toValue:CARD_HEIGHT,duration:1000,useNativeDriver:false}).start()
      Animated.timing(this.state.animateCardW,{toValue: CARD_WIDTH,duration:1000,useNativeDriver:false}).start()
      this.setState({activeCard:false})  
    }

  }
  
  showExpandCard=(marker,index)=>{//show the other values when card is bigger
    let user = firebase.auth().currentUser;//to get current user that is logged in
      return(
      <View style={{paddingTop:'5%'}}>
      <Text style={{marginTop:'5%', fontWeight:'bold'}}>Address: <Text style={{fontWeight:'normal'}}>{marker.Address}</Text></Text>
      <Text style={{marginTop:'5%', fontWeight:'bold'}}>Hours: <Text style={{fontWeight:'normal'}}>{marker.Opening}</Text></Text>
      <Text style={{marginTop:'5%', fontWeight:'bold'}}>Capacity: <Text style={{fontWeight:'normal'}}>{marker.Spaces}</Text></Text>
      <Text style={{marginTop:'5%', fontWeight:'bold'}}>Phone Number: <Text style={{fontWeight:'normal'}}>{marker.Phone}</Text></Text>
        {this.showAllPrices(marker)}
                   <DatePicker data={new Date()} width={CARD_WIDTH-40} markerName={marker.Name} user={user} address={marker.Address}/>

      </View>
        

      )
      
    
  }
  showAllPrices=(marker)=>{//show the values in AllPrices
    
      if(marker.AllPrices[0].Hours[0]!=undefined &&marker.AllPrices[0].Hours[0]!=null &&marker.AllPrices[0].Hours[1]!=undefined &&marker.AllPrices[0].Hours[1]!=null &&marker.AllPrices[0].Hours[2]!=undefined &&marker.AllPrices[0].Hours[2]!=null){
    
        return(
          <View>
            <Text style={{marginTop:'5%', fontWeight:'bold'}}>Prices:{" "}
              <Text style={{fontWeight:'normal'}}>
                {marker.AllPrices[1].Prices[0]}€/{marker.AllPrices[0].Hours[0]},{" "} 
                {marker.AllPrices[1].Prices[1]}€/{marker.AllPrices[0].Hours[1]}, {" "}
                {marker.AllPrices[1].Prices[2]}€/{marker.AllPrices[0].Hours[2]}
              </Text>
            </Text>
          </View>
         
          
        )}
        else if(marker.AllPrices[0].Hours[0]!=undefined &&marker.AllPrices[0].Hours[0]!=null &&marker.AllPrices[0].Hours[1]!=undefined &&marker.AllPrices[0].Hours[1]!=null){
    
          return(
            <View>
              <Text style={{marginTop:'5%', fontWeight:'bold'}}>Prices:{" "}
                <Text style={{fontWeight:'normal'}}>
                  {marker.AllPrices[1].Prices[0]}€/{marker.AllPrices[0].Hours[0]},{" "}
                  {marker.AllPrices[1].Prices[1]}€/{marker.AllPrices[0].Hours[1]}
                </Text>
              </Text>
            </View>
           
            
          )}
          else if(marker.AllPrices[0].Hours[0]!=undefined &&marker.AllPrices[0].Hours[0]!=null){
    
            return(
              <View>
                <Text style={{marginTop:'5%', fontWeight:'bold'}}>Prices:{" "}
                  <Text style={{fontWeight:'normal'}}>
                    {marker.AllPrices[1].Prices[0]}€/{marker.AllPrices[0].Hours[0]}
                  </Text>
                </Text>
              </View>
             
              
            )}
  }
  HideCard(){//Hide card when user not press on marker icon
    if(this.state.isHidden==false){
      this.setState({isHidden:true})
    }
    if(this.state.hideFilters==false){
      this.setState({hideFilters:true})
    }
    
  }
   searchParking(textToSearch){//search for parkings
    this.setState({searchBarFocused:true})
    this.setState({
      parkingFilter:this.state.data.filter(i=>i.Name.toLowerCase().includes(textToSearch.toLowerCase()))
      })
    if(textToSearch==''){
      this.setState({
        parkingFilter:[]
      })
    }
  }
  
  setRating(marker){//used to set the Rating for each user
    this.state.users.map((index,key)=>{
      if (user != null) {
        email = user.email;
         uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
        
      
        if(email==index.email){
        
          if(currentRating!==null){
            if(marker.Name==this.state.showtitle){
              let userRatings=[{parking:[marker.Name]},{rating:[currentRating]}]
            if(index.userRatings!==undefined){
              let counter=index.userRatings[0].parking.length
              for(let i=0;i<=counter;i++){
                if(index.userRatings[0].parking[i]==marker.Name){
                  index.userRatings[1].rating[i]=currentRating
                  break
                }
                else if(index.userRatings[0].parking[i]==undefined){
                  index.userRatings[1].rating[i]=currentRating
                  index.userRatings[0].parking[i]=marker.Name
                    
                }                  
              }
            }
            async function getAll(){
              const userEmail= firebase.firestore().collection('users')
              const snapshot=await userEmail.where('email','==',index.email).get()
              if (snapshot.empty) {
                return;
              }  
        
            snapshot.forEach(doc => {
              if(index.userRatings!==undefined){
                userEmail.doc(doc.id).update({userRatings:(index.userRatings)},{merge:true})
              }else{
                userEmail.doc(doc.id).set({userRatings:(userRatings)},{merge:true})
              }
              
            
            });
          }
          getAll()
          this.setState({currentRate:currentRating})
        }
          
      }
       
        
    if(index.userRatings!==undefined){
          for(let i=0;i<index.userRatings[1].rating.length;i++){
            if(index.userRatings[0].parking[i]==marker.Name){
              marker.Rating=index.userRatings[1].rating[i]
              
            }
          }
          
        }}
      }else{
        if(marker.Rating){
          return(
          <Rating fractions={1} startingValue={marker.Rating} onFinishRating={this.ratingCompleted} readonly={this.state.canNotRate} imageSize={15} ratingCount={5} style={{marginLeft:100,marginTop:4,position:'absolute'}}/>

        )
        }
        
      }
     })

    

  }
  ratingCompleted(rating) {//user to save temporalily the rating to save it after
    currentRating=rating
  }
    
  
  checkRating(marker){//used when app renders to put all the ratings
    this.state.users.map((index,key)=>{
      if (user != null) {
        email = user.email;
         uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.  
      } 
      if(index.userRatings!==undefined){
        for(let i=0;i<index.userRatings[1].rating.length;i++){
          if(index.userRatings[0].parking[i]==marker.Name){
            
            marker.Rating=index.userRatings[1].rating[i]
            
          }
        }
      }
 }
      
     )
  }
  showdirections(marker,location){//show directions from user to parking
    this.setState({showWay:false})
    this.setState({origin:{latitude:userLocationLat,longitude:userLocationLon}})
    this.setState({destination: {latitude:marker.Latitude,longitude:marker.Longitude}})
    this.setState({region:{latitudeDelta:0.0122,latitude:userLocationLat,longitude:userLocationLon,longitudeDelta:0.0122*ASPECT_RATIO}})  
    let temp1=this.state.origin
    let temp2=this.state.destination
    let distance=this.getDistanceFromLatLonInKm(this.state.origin.latitude,this.state.origin.longitude,this.state.destination.latitude,this.state.destination.longitude)//get distance from parking to user
   this.map.animateToRegion({latitude:this.state.region.latitude,longitude:this.state.region.longitude,
    latitudeDelta:this.state.region.latitudeDelta,longitudeDelta:this.state.region.longitudeDelta})//zoom in the user
    if(temp1==temp2||distance<0.004){
      Alert.alert('','You have reached your destination!')
      this.setState({origin:null})
      this.setState({destination:null})

    }
  }
  stopdirections(){//when user press the red button
    this.setState({showWay:true})
    this.setState({origin:null})
    this.setState({destination:null})
    this.setState({region: {
      latitude: 40.629269,
      longitude: 22.947412,
      latitudeDelta:  0.0922,
      longitudeDelta: 0.0922*ASPECT_RATIO,
    }})
  }
  
  showNormalCard(){
    const animatedStyles={
      width:this.state.animateCardW,
      height:this.state.animateCardH
    }
    let array=[...this.state.data]
    
    const card=array.map((marker, index) => (index<5)?(
      
      <Animated.View style={[this.state.CardStyle,animatedStyles]} key={index}>
        
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>
            {marker.Name}
          </Text>
          

          <TouchableOpacity  style={{position:'absolute',paddingLeft:'75%',paddingTop:'16%'}} 
          onPress={()=>this.startAnimation(marker)}>
            <InfoIcon name='info' size={30}/>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=> this.permissionHandle(marker)}  style={{backgroundColor: '#545BE1', alignItems: 'center', 
            justifyContent: 'center', borderRadius: 10, width:CARD_WIDTH-110,height:30}}>
               <Direction name="direction-sign"  backgroundColor="#FFF" color="#FFF" size={20} style={{alignSelf:'flex-start',paddingLeft:-5}}/>
             <Text style = {{color: '#FFF',position:'absolute'}}>Directions</Text>
            </TouchableOpacity >
            
            { this.state.users.map((index,key)=>{//used to change the star name unfortunately does not work when it passes all this in a function
              
              if(user!==null){
               email = user.email;
               uid = user.uid;
               if(email==index.email){
                 const results=[]
                 if(index.favouriteParking==undefined){
                    results.push(
                      <View key={index}  style={{position:'absolute',paddingLeft:'82%',paddingTop:'15%'}}>
                        <TouchableOpacity  onPress={()=>this.setFavourite(marker)}>
                      <AntDesign name='staro' size={30} color="#05375a" />
                      </TouchableOpacity>
                      </View>)
                 }else{
                    for(let i=0;i<=index.favouriteParking.length;i++){
                      if(index.favouriteParking[i]==marker.Name){
                        results.push(
                          <View style={{position:'absolute',paddingLeft:'82%',paddingTop:'15%'}}  key={i} >
                          <TouchableOpacity onPress={()=>this.setFavourite(marker)}>
                            <AntDesign name='star' size={30} color="#05375a" />
                            </TouchableOpacity>
                            </View>)
                      }else{
                        results.push(
                          <View key={i}  style={{position:'absolute',paddingLeft:'82%',paddingTop:'15%'}}>
                            <TouchableOpacity  onPress={()=>this.setFavourite(marker)}>
                          <AntDesign name='staro' size={30} color="#05375a" />
                          </TouchableOpacity>
                          </View>)
                      }
                  }
                 }
                
               return results
              }
          }})}
          
            <View>
              
            <Text style={{position:'absolute',fontWeight:'bold'}}>Rating:</Text>
            <Rating  fractions={1} startingValue={marker.Rating}   onFinishRating={this.ratingCompleted} readonly={this.state.canNotRate} imageSize={15} ratingCount={5} style={{marginLeft:100,marginTop:4,position:'absolute'}}/>
            </View>
            {this.showPrice(marker)}
            {this.showExpandCard(marker,index)}
            
            
        </View>
      </Animated.View>
    ):(null))
    return card
  }
  componentDidUpdate(prevProps, prevState){//used show that the title can take value from showtitle(problem with setState)
    if(currentRating!==null&&currentRating!==this.state.currentRate){
      {this.state.data.map((marker,index) => {
        {this.setRating(marker)}//minor problem the rating is saved when the app rerenders unfortunately that not happens when the rating is changed
      })}
      
    } 
    
   

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    if (this.myRef && this.myRef.current && this.myRef.current.showCallout ) {//set myRef here show that when it changed it's called before the update
      this.myRef.current.showCallout();
      
    }
    if(prevState.showtitle!==this.state.showtitle){//used to change the shown title
      
      
        {this.state.data.map((marker,index) => {
      
          return(
          <MapView.Marker onPress= {()=>this.markerClick(marker)}
            key={index}
            coordinate={{ latitude: marker.Latitude, 
            longitude: marker.Longitude}}
              
            description={marker.Description}
            title={this.state.showtitle} >
              
                          
          <ParkingIcon name="parking"  backgroundColor={this.state.markerColor}  color={this.state.markerColor}  size={30}/>
          
          </MapView.Marker >)
        
      })}
      
      
  }if(prevState.cardName!==this.state.cardName){//used to change the values in the card that is selected
    this.setState({showtitle:this.state.cardName})
      return(
        <MapView.Marker
          coordinate={{ latitude: this.state.cardLatitude, 
          longitude: this.state.cardLongitude}}
          title={this.state.cardName} >             
        <ParkingIcon name="parking"  backgroundColor={this.state.markerColor}  color={this.state.markerColor}  size={30}/>
        
      </MapView.Marker >)
      
    }
    if(this.state.activeCard==false){
      
      
      this.animation.addListener(({ value }) => {
        let index = Math.floor(value / (CARD_WIDTH) + 0.3); // animate 30% away from landing on the next item
        if (index >= this.state.data.length) {
          index = this.state.data.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }

        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          if (this.index !== index) {
            this.index = index;
            
            const { Latitude } = this.state.data[index];
            const {Longitude}=this.state.data[index]
            let coordinate={
              latitude:Latitude,
              longitude:Longitude
            }
            
            this.setState({cardName:this.state.data[index].Name})
            this.setState({cardLatitude:this.state.data[index].Latitude})
            this.setState({cardLongitude:this.state.data[index].Longitude})
            this.map.animateToRegion(
              {
                ...coordinate,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
              },
              350
            );
          }
        }, 10);
      });
    interpolations = this.state.data.map((marker, index) => {
      const inputRange = [
        (index - 1) * (CARD_HEIGHT),
        index * (CARD_WIDTH),
        (index + 1) * (CARD_WIDTH),
      ];
      
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });
    }
    
    if(this.state.activeCard==true){
      this.animation.addListener(({ value }) => {
        let index = Math.floor(value / (CARD_WIDTH+100) + 0.3); // animate 30% away from landing on the next item
        if (index >= this.state.data.length) {
          index = this.state.data.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }

        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          if (this.index !== index) {
            this.index = index;
            
            const { Latitude } = this.state.data[index];
            const {Longitude}=this.state.data[index]
            let coordinate={
              latitude:Latitude,
              longitude:Longitude
            }
            
            this.setState({cardName:this.state.data[index].Name})
            this.setState({cardLatitude:this.state.data[index].Latitude})
            this.setState({cardLongitude:this.state.data[index].Longitude})
            this.map.animateToRegion(
              {
                ...coordinate,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
              },
              350
            );
          }
        }, 10);
      });
    interpolations = this.state.data.map((marker, index) => {
      const inputRange = [
        (index - 1) * (CARD_HEIGHT),
        index * (CARD_WIDTH+100),
        (index + 1) * (CARD_WIDTH+100),
      ];
      
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });
    }
   
  }
  
  showFilter(){//show-hide scrollview when filter icon is pressed
    if(this.state.hideFilters==true){
      this.setState({hideFilters:false})
    }else if(this.state.hideFilters==false){
      this.setState({hideFilters:true})
    }
  }
  showSearch(){
    if(this.state.hideSearch==true){
      this.setState({hideSearch:false})
    }else if(this.state.hideSearch==false){
      this.setState({hideSearch:true})
    }
  }
  toggleSwitch(){//enable disable switch in filters
    let temp=this.state.enable
   this.setState({enable:!temp})
  }
  
  render() {
    const filtersRegion=[<View key={Math.floor(Math.random() * 10000) + 1 }> 
           
      <ListItem  bottomDivider   Component={TouchableScale}  style={{ justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
        flex: 1,}}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
    >
      
        
          <ListItem.Content numberOfLines={3}>
          <Text>Toumba</Text>
           
           <Switch  style={{paddingBottom:'5%'}}
         trackColor={{ false: "#767577", true: "#81b0ff" }}
         thumbColor={this.state.enableToumba ? "#f5dd4b" : "#f4f3f4"}
         onValueChange={(enableToumba)=>this.setState({enableToumba})}
         onChange={()=>this.showOnlyRegionT()}
         value={this.state.enableToumba} 
         />
          <Text>Xarilaou</Text>
            <Switch  style={{paddingBottom:'5%'}}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={this.state.enableXarilaou ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={(enableXarilaou)=>this.setState({enableXarilaou})}
          onChange={()=>this.showOnlyRegionX()}
          value={this.state.enableXarilaou} 
          />
           
           
           <Text>Center</Text>
            <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={this.state.enableKentro ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={(enableKentro)=>this.setState({enableKentro})}
          onChange={()=>this.showOnlyRegionK()}
          value={this.state.enableKentro} 
          />
        
           
          </ListItem.Content>
        
      </ListItem></View>]//creation of data that will be passed in Accordion component. When is pressed this data will shown
    const filtersPrices=[<ListItem key={Math.floor(Math.random() * 10000) + 1 } bottomDivider   Component={TouchableScale}  style={{ justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,}}
    friction={90} //
    tension={100} // These props are passed to the parent component (here TouchableScale)
    activeScale={0.95} //
    >

      
        <ListItem.Content numberOfLines={3}>
        <Text>Less than 2€</Text>
          <Switch  style={{paddingBottom:'5%'}}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={this.state.enableLowPrice ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={(enableLowPrice)=>this.setState({enableLowPrice})}
        onChange={()=>this.showOnlyLowPrice()}
        value={this.state.enableLowPrice} 
        />
          <Text>Bigger than 2€</Text>
        
          <Switch  style={{paddingBottom:'5%'}}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={this.state.enableHighPrice ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={(enableHighPrice)=>this.setState({enableHighPrice})}
        onChange={()=>this.showOnlyHighPrice()}
        value={this.state.enableHighPrice} 
        />
        
        
        </ListItem.Content>
      
    </ListItem>]  //creation of data that will be passed in Accordion component. When is pressed this data will shown
if(this.state.enable==false &&userLocationLat==null){//used for the first render to get user distance right
  const checkUser = async () => {

    let location= await RNLocation.getLatestLocation({timeout: 100})//user location
     if(location!==null){
       userLocationLat=location.latitude
       userLocationLon=location.longitude
       this.categorizeParkings()
     }
   }
   {checkUser()}
  
    
  
  
}
if(this.state.enable==true){//switch true categorize parkings
  this.categorizeParkings()

}

    user = firebase.auth().currentUser;
   
    const animatedStyles={
      width:this.state.animateCardW,
      height:this.state.animateCardH
    }
    let interpolations = this.state.data.map((marker, index) => {//used for the animation on cards
      {this.checkRating(marker)}//used to show the rating
      
      const inputRange = [
        (index - 1) * CARD_HEIGHT,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });
    
    this.dataMarkers()//used for the first render
    
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <View>
          <Header>{/* used for the Header Up also for the button Up right*/}
            <Left style={{ flexDirection: 'row' }}>
              <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: 'white', marginRight: 15 }} />
            </Left>
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{ color: 'white',fontWeight:'bold',fontSize:20,paddingRight:'30%' }} >Google Maps</Text>
            </View>
            
            <Right>
            <ParkingIcon name="search-location" style={{color: 'white',marginRight: '20%'}} onPress={()=>this.showSearch()} size={25}/>

              <AntDesign name='filter'style={{ color: 'white', marginRight: 10, }} size={25} onPress={()=>this.showFilter()}/>
            </Right>
          </Header>

        <MapView 
          followsUserLocation={true}
          showsUserLocation={true}
          customMapStyle={mapstyle}
          provider={this.props.provider}
          ref={(map) => (this.map = map)}
          style={styles.map}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          initialRegion={this.state.region}
         onPress={()=>this.HideCard()}
        >
          <MapViewDirections
          origin={this.state.origin}
          destination={this.state.destination}
          apikey={GOOGLE_MAPS_APIKEY} // insert your API Key here
          mode='DRIVING'
          strokeWidth={5}
          strokeColor="#545BE1"
        />
    
        {this.state.defaultData.map((marker,index) => {
          const results=[]
          let exists=false
          const region=[]
          if(this.state.cardName==marker.Name){
            return(
              <MapView.Marker onPress= {()=>this.markerClick(marker)}
              ref={this.myRef}
              key={index}
              coordinate={{ latitude: marker.Latitude, 
              longitude: marker.Longitude}}
              description={marker.Description}
              title={marker.Name} >
                
                            
                <ParkingIcon name="parking"  backgroundColor={this.state.markerColor}  color={this.state.markerColor}  size={30}/>
            
              </MapView.Marker >
            )
          }if(this.state.enable==false){//if switch is disable
            return(
              <MapView.Marker onPress= {()=>this.markerClick(marker)}
            key={index}
            coordinate={{ latitude: marker.Latitude, 
            longitude: marker.Longitude}}
            description={marker.Description}
            title={marker.Name} >
              
                          
              <ParkingIcon name="parking"   color='#545BE1'  size={30}/>
          
            </MapView.Marker >
              
            )
          }
          
          

          
          for(let i=0;i<this.state.orangeParkings.length;i++){//check orange parkings when switch is enable
            if(this.state.orangeParkings[i]==marker.Name){
              results.push(
                <MapView.Marker onPress= {()=>this.markerClick(marker)}
                key={index}
                coordinate={{ latitude: marker.Latitude, 
                longitude: marker.Longitude}}
                description={marker.Description}
                title={marker.Name} >
                  
                              
                  <ParkingIcon name="parking"   color='#F7A10B'  size={30}/>
              
                </MapView.Marker >);
              exists=true
              break

            }
          }
          for(let i=0;i<this.state.greenParkings.length;i++){//check green parkings when switch is enable
            if(this.state.greenParkings[i]==marker.Name){
              results.push(
                <MapView.Marker onPress= {()=>this.markerClick(marker)}
                key={index}
                coordinate={{ latitude: marker.Latitude, 
                longitude: marker.Longitude}}
                description={marker.Description}
                title={marker.Name} >
                  
                              
                  <ParkingIcon name="parking"   color='#2FE94E'  size={30}/>
              
                </MapView.Marker >);
              exists=true
              break

            }
          }
          if(exists==false&&this.state.enable==true){
            results.push(
              <MapView.Marker onPress= {()=>this.markerClick(marker)}
              key={index}
              coordinate={{ latitude: marker.Latitude, 
              longitude: marker.Longitude}}
              description={marker.Description}
              title={marker.Name} >
                
                            
                <ParkingIcon name="parking"   color='#DE2323'  size={30}/>
            
              </MapView.Marker >
              
            )
          }
          
          return results 
    
          })
          
        }
        


        </MapView>
        <MyView hide={this.state.showWay} style={{position: 'absolute',
            top: '63%', right:'7%',
            alignSelf: 'flex-end'}} >
              <TouchableOpacity onPress={()=>this.stopdirections()}><AntDesign name='closecircle' color='red' size={30}/></TouchableOpacity>

          </MyView>
        <MyView hide={this.state.isHidden}>
          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={this.state.animateCardW}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.animation,
                      
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}
          > 
          

          {this.showNormalCard()}
          </Animated.ScrollView>
        </MyView>    
        <MyView style={{position:'absolute',marginTop:'15%'}} hide={this.state.hideSearch}>

        <Animatable.View animation={this.state.hideSearch?"fadeOut":"fadeIn"} duration={1000} style={styles.searchBox} >
        
            <TextInput 
            placeholder="Find Parking" 
            onChangeText={text=>{this.searchParking(text)}} key='SearchBar'
            placeholderTextColor="#000"
            autoCapitalize="none"
            textAlign="left"
            onSubmitEditing={Keyboard.dismiss}
            style={{flex:1,padding:0}}/>
            
           
           
           <ParkingIcon name="search-location" style={{paddingTop:'0.5%'}} backgroundColor="#545BE1" color="#545BE1"  size={30}/>
        </Animatable.View>
         
           

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
         </MyView>
         <MyView style={{position:'absolute',marginTop:'45%',paddingRight:'50%'}} hide={this.state.hideFilters}>
           <Animatable.View style={styles.filters} animation={this.state.hideFilters?"lightSpeedOut":"lightSpeedIn"} duration={1000}>
            <ScrollView  showsVerticalScrollIndicator={false} >
            
              <ListItem  bottomDivider   Component={TouchableScale} 
              friction={90} //
              tension={100} // These props are passed to the parent component (here TouchableScale)
              activeScale={0.95} //
            >
              
                <ListItem.Content>
                  <Text style={{fontSize:15}}>See the best options</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.enable ? "#f5dd4b" : "#f4f3f4"}
                  onValueChange={(enable)=>this.setState({enable})}
                  
                  value={this.state.enable} 
                  />
                
                </ListItem.Content>
              </ListItem>
              <Accordian title={'Regions'} key={1} data={filtersRegion}></Accordian>
              <Accordian title={'Prices'} key={2} data={filtersPrices}></Accordian>


          
          </ScrollView>
          </Animatable.View></MyView>
         
          
      </View>
    </Container>
  </TouchableWithoutFeedback>
  );
    
  }
}// End of MyHomeScreen class
export default (GoogleMapScreen);

const styles = StyleSheet.create({
 //searchBar
 searchBox: {
  flex:1,
  paddingLeft:'10%',
  flexDirection:'row',
  backgroundColor: '#fff',
  width: '300%',
  height:'5%',
  top:'16%',
  left:'20%',
  marginLeft:'10%',
  borderRadius: 5,
  padding: 5,
  marginTop:'-15%',
  shadowColor: '#ccc',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.5,
  shadowRadius: 5,
  elevation: 10,
}, filters: {
  flex:1,
  paddingLeft:'10%',
  flexDirection:'row',
  backgroundColor: '#fff',
  width: '120%',
  height:'55%',
  marginLeft:'40%',
  borderRadius: 5,
  padding: 5,
  marginTop:'-15%',
  shadowColor: '#ccc',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.5,
  shadowRadius: 5,
  elevation: 10,
 
},
   map: {
     position:'relative',
    width: width,
    height: 800,
   },  
  container: {
    flex: 1,
    
  },
  cardView:{
    position:'absolute', 
   
    
    
    },
    scrollView: {
      position: "absolute",
      bottom: height*0.21,
      left: 0,
      right: 0,
      paddingVertical: '3%',
      
    },
    endPadding: {
      paddingRight: width - CARD_WIDTH,
    },
    card1: {
      borderRadius:5,
      padding: 10,
      elevation: 2,
      backgroundColor: "#FFF",
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.9,
      shadowOffset: { x: 2, y: -2 },
      overflow: "hidden",
    },
    card2: {
      borderRadius:5,
      padding: 10,
      elevation: 2,
      backgroundColor: "#FFF",
      marginRight:5,
      marginLeft:2,
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.9,
      shadowOffset: { x: 2, y: -2 },
      overflow: "hidden",
      
    },
    textContent: {
      flex: 1,
    },
    cardtitle: {
      fontSize: 18,
      marginTop: 5,
      
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
    markerWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    marker: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(130,4,150, 0.9)",
    },
    box: {
      height: 150,
      width: 150,
      backgroundColor: "blue",
      borderRadius: 5
    }

});
