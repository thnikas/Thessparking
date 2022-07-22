import React,{useState, useEffect} from 'react'
import {StyleSheet,BackHandler,ActivityIndicator, Alert,View,Dimensions,ScrollView,Image,Button,Touchable,TouchableOpacity,TouchableHighlight,TextInput,SafeAreaView,Animated,Keyboard,TouchableWithoutFeedback} from 'react-native';
import {Container,Header,Left,Right,Icon,Text,Body } from 'native-base';
import firebase  from 'firebase';
import { Defs, LinearGradient, Stop, Svg, Path,Line, Rect,G,Circle,ClipPath,Text as TextSvg,Polygon,Use,Symbol } from 'react-native-svg'
import { LineChart, Grid, XAxis,YAxis } from 'react-native-svg-charts'
import LineChartExample from './LineChart';
import moment from 'moment'

let data = []//data that is shown on the graph
const Line1={
    strokeWidth: 2,
    stroke: 'rgb(255, 255,255)',
   
}
const LabelsX = ['SU','MO','TU','TH','WE','FR','SA'];
const color1='#FF6F9D'

const Linegraph=()=> {
    const getSunday = (date) => {//get days of the week
        const dayIndex = date.getDay();
        const diffToLastSunday = (dayIndex !== 0) ? dayIndex : 6;
        return new Date(date.setDate(date.getDate() - diffToLastSunday));
      }
      let getArrayDate=[]

      const getSaturday = (sunday) => {//get saturday and pass the values in an array that will be used to show the data
        let temp=null
        for(let i=0;i<7;i++){
            temp=moment(sunday).add(i,'days').toDate()
            temp=moment(temp).format('D M YYYY')
            getArrayDate.push(temp)
          
        }
        return moment(sunday).add(6, 'days').toDate();
      }
      const [Sunday, setSunday] = useState(getSunday(new Date()));
      const [Saturday, setSaturday] = useState(getSaturday(Sunday));
      const [loaded,setLoaded]=useState(false)//when values are not loaded show loader
      const [changeDate,setChangeDate]=useState(false)//used to show loader when prices of the graph are changing
      const [enterSecond,setEnterSecond]=useState(false)//activates show second loader
      function changeData() {//change the date values when arrow is pressed and activates loader
        setSunday(moment(Sunday).add(7, 'days').toDate());
        setSaturday(moment(Saturday).add(7, 'days').toDate());
        setChangeDate(false)
        setEnterSecond(true)
      }
      function changeData2() {//change the date values when arrow is pressed and activates loader
        setSunday(moment(Sunday).subtract(7, 'days').toDate());
        setSaturday(moment(Saturday).subtract(7, 'days').toDate());
        setChangeDate(false)
        setEnterSecond(true)
      }
      
      function showUserStatistics(){//show data function
        user = firebase.auth().currentUser;
        data=[]
        let id=null
        let parking=null
        async function findParking(){//find which parking user that is logged in owns
          const snapshot1=await firebase.firestore().collection('users').where('email' ,'==',user.email).get()
            snapshot1.forEach(doc => {
              parking=doc.data()['parkingOwned']
            })
              
          const snapshot=await firebase.firestore().collection('data').where('Name' ,'==',parking).get()//get parking id 
          snapshot.forEach(doc => {
            id=doc.id

          });
         const dataGraph= await firebase.firestore().collection('frequent').doc(id).get()
         const dates=dataGraph.data()['date'][0]['value']//dates that parking icon had been pressed
         const counters=dataGraph.data()['date'][1]['counter']//times that parking icon had been pressed in each date
         if(data.length<7){//set values in data table
            for(let i=0;i<getArrayDate.length;i++){
                for(let j=0;j<dates.length;j++){
                 if(dates[j]==getArrayDate[i]){//if exists set value
                   data.push(counters[j])
                   break;
                 }else{
                   if(j==dates.length-1){//if not exists set value 0
                     data.push(0)
                   }
                   
                 }
                }
                
              }
              if(data.length==7){//when is 7 show the graph
               
                  setLoaded(true)
                  setEnterSecond(false)

              }
         }else{//second check if needed 
            for(let i=0;i<getArrayDate.length;i++){
                for(let j=0;j<dates.length;j++){
                 if(dates[j]==getArrayDate[i]){
                   data[i]==counters[j]
                   break;
                 }else{
                   if(j==dates.length-1){
                     data[i]==0
                   }
                   
                 }
                }
                
              }
              if(data.length==7){
                  setLoaded(true)
                  setEnterSecond(false)
              }
         }
         
        }
        findParking()
      }
      useEffect(()=>{
        
        showUserStatistics()//called every time values changes
       },[Sunday,Saturday,data,])//update the state of the values
        if(loaded==false){//show first loader
            return(
                <View style={[styles.container, styles.horizontal]} >
                    <ActivityIndicator size="large" color='#545BE1' />
                  </View> 
                            
                    )
        }else if(changeDate==false&&enterSecond==true){//show loader when values are changing
          return (
              <View style={{paddingTop:'10%'}}>
                  <LineChartExample
                  Sunday={Sunday}
                  Saturday={Saturday}
                  changeData={changeData}
                  changeData2={changeData2} 
                  ymin={0}
                  ymax={30}
                  data={data}
                  lineSvg={{stroke:'white'}}
                  graphLine={Line1}
                  appColor='#6CABFD'
                  appColor2={color1}
                  xAxisLabels={LabelsX}
                  ticks={4}
                  strokeWidth={2}
                  strokeDasharray={[8,4]}
                  strokeColor={'#DC1640'}
                  hideSmallLines={false}
                  ></LineChartExample>
                  <View style={[styles.container, styles.horizontal],{marginTop:-220, }} >
                  <ActivityIndicator size="large" color='#545BE1' />
                </View> 
                 

              
                                   
              </View>
        );
      }
          return (
            <View style={{paddingTop:'10%'}}>
                <LineChartExample
                Sunday={Sunday}
                Saturday={Saturday}
                changeData={changeData}
                changeData2={changeData2} 
                ymin={0}
                ymax={30}
                data={data}
                lineSvg={{stroke:'white'}}
                graphLine={Line1}
                appColor='#6CABFD'
                appColor2={color1}
                xAxisLabels={LabelsX}
                ticks={4}
                strokeWidth={2}
                strokeDasharray={[8,4]}
                strokeColor={'#DC1640'}
                hideSmallLines={false}
                ></LineChartExample>
  
             
            </View>
      );
        
       
        
   
    
  
}
export default Linegraph
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