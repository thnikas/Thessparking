import React,{useState, useEffect} from 'react'
import { View, Text, StyleSheet,Button, TouchableOpacity, Dimensions, TouchableHighlight,Switch, Group } from 'react-native'
import {ScrollView, TouchableWithoutFeedback} from 'react-native-gesture-handler'
import * as d3Scale from 'd3-scale';
import { Defs, LinearGradient, Stop, Svg, Path,Line, Rect,G,Circle,ClipPath,Text as TextSvg,Polygon,Use,Symbol } from 'react-native-svg'
import { LineChart, Grid, XAxis,YAxis,BarChart } from 'react-native-svg-charts'
import MyView from '../../MyView'
import moment from 'moment'
import { add } from 'react-native-reanimated';
import  Ionicons  from 'react-native-vector-icons/Ionicons'; 
import firebase from 'firebase'


const windowWidth = Dimensions.get('window').width;

let LinesPosition=" M6 100 L6 90"
let m="M"
let l=" L"
let hun='100'
let en='90'
let val='6.5'
let g=m+val+' '+hun+' '+l+val+' '+en

if(windowWidth>410){
    a="M6 100 L6 90 M57 100 L57 90 M108 100 L108 90 M159 100 L159 90 M210 100 L210 90 M261 100 L261 90 M312 100 L312 90 "
}else if(windowWidth<321){
    a="M6 100 L6 90 M42 100 L42 90 M78 100 L78 90 M114 100 L114 90 M150 100 L150 90 M186 100 L186 90 M222 100 L222 90 "

}else if(windowWidth>390){
    a="M6 100 L6 90 M57 100 L57 90 M100 100 L100 90 M147 100 L147 90 M194 100 L194 90 M241 100 L241 90 M288 100 L288 90 "

}
const Lines=({y})=>(

    <View style={{position:"absolute",  flex:1,marginHorizontal:-6 }}>
        <Svg   height="400" width="400">

            <Path    
                y={85}//position of small white lines
                //scale={d3Scale.scaleLinear()}
                d={LinesPosition} //alocate small white lines
                fill='none'    
                stroke="white"
            />

        </Svg>
    </View>
)


const AppButton = ({ onPress, title }) => (
    <View style = {styles.containerButtons}> 
        <TouchableOpacity style={styles.appButtonContainer } >
               
                <Text style={styles.appButtonText}>{title}</Text>
             </TouchableOpacity>
             </View>
    )

const LineChartExample=(props)=>{
    const getSunday = (date) => {
        const dayIndex = date.getDay();
        const diffToLastSunday = (dayIndex !== 0) ? dayIndex : 6;
        return new Date(date.setDate(date.getDate() - diffToLastSunday));
      }
      let getArrayDate=[]

      const getSaturday = (sunday) => {
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
    
      
   
    function checkFavouriteUsers(){//used to see the owner how many users had set his prking to their favourites
      
        user = firebase.auth().currentUser;
        let counter=0
        async function saveFavourite(){
            const snapshot=await firebase.firestore().collection('users').where('email' ,'==',user.email).get()
            snapshot.forEach(doc => {
              setParkingOwned(doc.data()['parkingOwned'])
              firebase.firestore().collection('users').get().then((querySnapshot)=>{              
                const objectsArray = [];
                querySnapshot.forEach((user) => {
                  objectsArray.push(user.data());
                });
                objectsArray.map((index,key)=>{
                  if(index.favouriteParking!==undefined){
                    for(let i=0;i<index.favouriteParking.length;i++){
                      if(index.favouriteParking[i]==doc.data()['parkingOwned']){
                       
                        counter=counter+1
                        setCounterFavourites(counter)
      
                      }
                    }
      
                  }
                 
                  
                })
              });
                })
               
        }
        saveFavourite()
        
    }

    function graphType(){//change the graphType
        if(isChanged==false){

        
        return( <View  style={{ height: 200,  flexDirection:'row',marginTop:20, marginLeft:'4%'}}   onLayout={(event) => {
            const {x, y, width, height} = event.nativeEvent.layout
            setDimensionsY({width:width, height:height});
    }}>
            
           <View style={{ height: 200,  flexDirection:'row'}}  ><YAxis
            
            data={props.data}
            min={props.ymin}
            max={props.ymax}
            style={{  marginBottom: xAxisHeight ,marginRight:'2%'}}
            contentInset={verticalContentInsetYLabel}
            svg={axesSvg}
            
            numberOfTicks={props.ticks}
            formatLabel={(value,index)=>value}                               

        /></View>
           
            
             <View  style={{ flex: 1, paddingRight:'5%'}} >
             <MyView hide={props.hideSmallLines} ><Lines belowChart={true} /></MyView>
                
              
                <LineChart 
                
                 yMax={props.ymax}
                 yMin={props.ymin}
                 gridMin={0}
                    style={ { flex:1 } }
                    data={ props.data }
                    numberOfTicks={props.ticks}
                    contentInset={ verticalContentInset}
                    
                    svg={props.graphLine}
                    
                >
                    
                    <Grid  svg={props.lineSvg} belowChart={true}/>
                    <ChartPoints color="#98FFFE" belowChart={false}/>
                    
                    {tooltipPosx && <Tooltips />}
                    
                </LineChart>
                <View onLayout={(event) => {
                    const {x, y, width, height} = event.nativeEvent.layout
                    setDimensionsX({width:width, height:height});
            }}><XAxis svg={axesSvg} 
                
            formatLabel={(value,index)=>props.xAxisLabels[index]}
           data={props.data} 
           
           contentInset={{ left: 10, right: 10 }}
           style={{marginHorizontal: -15, height:xAxisHeight , paddingHorizontal:10,  marginTop:10,}}
           /></View>
                
               
             </View>
            
            
           
            </View>)}else if(isChanged==true){
                 return(
                    <View style={{ height: 200, padding:20, flexDirection:'row',   }}>
                    <YAxis
                           data={props.data}
                           min={props.ymin}
                           max={props.ymax}
                           style={{  marginBottom: xAxisHeight ,marginRight:'2%'}}
                           contentInset={verticalContentInsetYLabel}
                           svg={axesSvg}
                           
                           numberOfTicks={props.ticks}
                           formatLabel={(value,index)=>value} 
                        ></YAxis> 
                        <View style={{ flex: 1, marginLeft: 10,position:'relative' }}  >
                        
                            <BarChart
                                yMax={props.ymax}
                                yMin={props.ymin}
                                gridMin={0}
                                numberOfTicks={props.ticks}
                                style={{ flex: 1 }}
                                data={props.data}
                                svg={{ fill: '#FFFFFF' }}
                                contentInset={verticalContentInset}
                                spacingInner={0.3}
                                
                            >
                        
                        <Grid svg={props.lineSvg} belowChart={true}/>    
                                   
                            </BarChart >
                                           
                                                           
                            <XAxis 
      style={{marginHorizontal: -15, height:xAxisHeight , paddingHorizontal:10,  marginTop:10,}}
                                  data={props.data}
                                formatLabel={(value, index) => props.xAxisLabels[index]}
                                contentInset={{ left: 10, right: 10 }}
                                svg={axesSvg}
                                
                                
                            />
                      
                        </View>
                    
                       
                        
    
                    </View>)
            }
    }
    const ChartPoints = ({ x, y,  }) => {//circles on the lines top
        return props.data.map((value, index) => (
            checkCircles(value,index,x,y)
                
            
          
        ));
      };
      const [z,setZ]=useState(0)
      function checkCircles(value,index,x,y){
       
         if(index==props.data.length&&index+1!=props.data.length ) {
            return(<Circle
                key={index}
                cx={x(index)}
                cy={y(value)}
                r={8}
                stroke={'#DC1640'}
                fill="white"
                onPress={() => {
                  toggleToolTip(index);
                  
                  
                 
                }}
              />)
        }else{
            
            
            return(<Circle
                key={index}
                cx={x(index)}//change circles position
                cy={y(value)-3}//change circles position
                r={8}//change circles size
                stroke={'#DC1640'}
                fill="white"
                onPress={() => {
                  toggleToolTip(index);
                  changevalues(value)
                  changevalues(value)
                   
                    
                }}
              />)
        }
            
        
      }
      function changevalues(value){
          return(setZ(10+19.3*((value-40)/10)))
      }
      const CUT_OFF=1;
      

    const toggleToolTip = (index) => {
        if (!tooltipPosx) {
          setActiveToolTip(index);
          setTooltipPosx(true);
        } else if (tooltipPosx) {
          setActiveToolTip(index);
        }
        if (activeToolTip == index) {
          setTooltipPosx(false);
        }
      };
      const Tooltips = ({ x, y }) => {
          
        return props.data.map((value, index) => {
          if (activeToolTip === index) {
            return (
              <Svg key={index}>
                <Svg width="200" height="100" >
                    <Symbol id="symbo2" viewBox="0 0 100 200" width="100" height="50">

                    <Rect
                    
                    x={25}
                    y={20}
                    width="70"
                    height="40"
                    fill="grey"
                    strokeWidth="3"
                    //stroke="rgb(0,0,0)"
                    rx={5}
                    />
                    <Polygon
                    
                    x={-44}
                    y={-30}
                points="70,60 70,80 30,70"
                fill="grey"
                //stroke="purple"
                strokeWidth="1"
            
                />
                <TextSvg
                  x={x(index)}
                  y={10+19.3*((value-40)/10)}
                  fontSize={10}
                  
                  fontWeight="bold"
                  fill={value >= CUT_OFF ? 'black' : 'white'}
                  alignmentBaseline={'middle'}
                  
                  textAnchor={'middle'}>
                  {`${props.data[index]}`}
                </TextSvg>
             </Symbol>
                <Use  href="#symbo2" x="0" y="0" width="150" height="150" />
                
            </Svg>
              </Svg>
            );
          } else {
            return null;
          }
        });
      };
    
    const [isEnabled, setIsEnabled] = useState(false);//used for the first switch
    const [isEnabled2, setIsEnabled2] = useState(false);//used for the second switch
    const toggleSwitch = () => {setIsChanged(previousState => !previousState)};//used for the first switch
    const toggleSwitch2 = () => {setIsEnabled2(previousState => !previousState) ,showStatistics()};//used for the second switch
    const [isHidden, setHidden]=useState(true)//show-hide the statistics(Must enter the component MyView for this to work)
    const axesSvg = { fontSize: 15, fill: 'white',fontWeight:'bold'};
    const xAxisHeight =10
    //const [arrayDate,getArrayDate]=useState([])
    const verticalContentInset = { top: 10, bottom: 0 ,right:4,left:4 }
    const verticalContentInsetYLabel={ top: 10, bottom: 10 } 
    const [tooltipPosx, setTooltipPosx] = useState(false);
    const [activeToolTip, setActiveToolTip] = useState(null);
    let [appColor, setAppColor]=useState(props.appColor)
    const [dimensionsX, setDimensionsX] = useState({width:0, height:0})    
    const controlLine=dimensionsX.width/(props.data.length-1)//the space between the small lines
    const [dimensionsY, setDimensionsY] = useState({width:0, height:0})
    const height=dimensionsY.height/(props.data.length-1)
    const [isChanged,setIsChanged]=useState(false)
    const [counterFavourites,setCounterFavourites]=useState(0)
    const [parkingOwned,setParkingOwned]=useState(null)
    
    useEffect(()=>{
        setAppColor(props)
        
    },[props])
    useEffect(()=>{
      checkFavouriteUsers() 
      //showUserStatistics()
     },[props.data])
     
        
        
        
        for(let i=1;i<((props.xAxisLabels.length*2)-1);i++){
            if(i==((props.xAxisLabels.length*2)-1)){
            }
            val=+val+controlLine
            LinesPosition=LinesPosition+" "+(m+val+' '+hun+' '+l+val+' '+en)
            i++
           
            
        }
    

    function showStatistics(){//show Stats
        if(isEnabled2==false){
            setHidden(false)
        }
        else{
            setHidden(true)
        }
    }
           
         //Average
         var total = 0;
         for(var i = 0; i < props.data.length; i++) {
             total += props.data[i];
         }
         var avg = total / props.data.length;
        avg= parseFloat(avg).toFixed(0);
 
         //Max
         function getArrayMax(array){
             return Math.max.apply(null, array);
          }
          var maxValue=getArrayMax(props.data);
         //Min
          function getArrayMin(array){
             return Math.min.apply(null, array);
          }
          var minValue=getArrayMin(props.data)
          
            return ( 
            
                <View style={{paddingBottom:20,paddingTop:'10%',marginTop:-40}}  backgroundColor={appColor} >
                    <ScrollView>
                    <View  >
                    <Text style={{alignSelf:'flex-end',color:'#ffffff',fontSize:20,fontWeight:'bold',paddingRight:'2%'}}>Change graph</Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isChanged ? "#f5dd4b" : "#f4f3f4"}
                      onValueChange={toggleSwitch}
                      value={isChanged} 
                    />
                
                  </View>
                  <View style={{flexDirection:'row', paddingHorizontal:'14%',paddingTop:'5%'}}>
                    <AppButton title="WEEK" size="sm" />
                    <AppButton title="MONTH" size="sm"/>



                </View>
                
                <View style={{ flexDirection: 'row', alignContent: 'center',  alignItems: 'center', paddingHorizontal:90}}>
                  <Ionicons name="ios-arrow-back" size={30} color="grey" onPress={()=>props.changeData2()/* onPress change data on the graph this function is called from Linegraph*/ } />
                  <Text style={styles.contentDate}>{moment(props.Sunday).format("DD")}-{moment(props.Saturday).format("DD MMMM")}</Text>
                  <Ionicons name="ios-arrow-forward" size={30} color="grey" onPress={() => props.changeData()} />
                 </View>
                    {graphType()}
                   
                   
                    
                    <View>
                        <View style={{alignItems:"flex-end", paddingTop:'4%',paddingRight:'3%'}}>
                          <Text style={{color:'#ffffff',fontSize:20,fontWeight:'bold'}}>Press Here</Text>
                          <Switch
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
                          onValueChange={toggleSwitch2}
                          value={isEnabled2} 
                          />
                        
                        </View>
                        <MyView hide={isHidden}>
                          <Text style={styles.text1}>Statistics</Text>
                          <View style={{flexDirection:'row',paddingTop:'2%' }}>
                              <Text style={styles.text2}>Min </Text>
                              <Text style={styles.text2}>Average </Text>
                              <Text style={styles.text2}>Max </Text> 
                              
                          </View>
        
                    
                        <View style={{flexDirection:'row' }}>
                            <Text style={styles.text3}>{minValue}</Text>
                            <Text style={styles.text3}> {avg}</Text>
                            <Text style={styles.text3}> {maxValue}</Text> 
                           
                            
                        </View>
                      <View>              
                      <Text style={{color:'#ffffff',fontSize:15,fontWeight:'bold',paddingHorizontal:'2%'}}>The users who have added your parking to their favourites are: {counterFavourites}</Text>

                    </View>         
                  </MyView>
                </View>
              </ScrollView>
          </View>
                
        )  
        
    }



const styles=StyleSheet.create({
    text1:{
        paddingLeft:'37%',
        fontWeight:'bold',
        fontSize:20,
        color:'#FFFFFF'
    },
    text2:{
        
        textAlign:'center',
        fontWeight:'bold',
        fontSize:14,
        color:'#FFFFFF',
       paddingLeft:'10%',
       paddingRight:'3%',
        
    },
    text3:{
        textAlign:'center',
        fontWeight:'bold',
        fontSize:25,
        color:'#FFFFFF',
        paddingLeft:'18%',
        paddingRight:'8%'
    },
  
talkBubbleSquare: {
    width: 70,
    height: 40,
    backgroundColor: "red",
    borderRadius: 10,
  },
  talkBubbleTriangle: {
    position: "absolute",
    left: -26,
    top: 10,
    width: 0,
    height: 0,
    borderTopColor: "transparent",
    borderTopWidth: 10,
    borderRightWidth: 30,
    borderRightColor: "red",
    borderBottomWidth: 10,
    borderBottomColor: "transparent",
  },appButtonContainer: {
    marginLeft:25,
    marginRight:25,
  
    elevation: 8,
    backgroundColor:'#70D2F6',
    alignContent:'center',
    alignItems:'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonDisabled: {
    backgroundColor: "#000"
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
    textTransform: "uppercase"
  },contentDate:{
      fontWeight:'bold',
    fontSize:15,
    color:'white',
    padding:20,
    
}})

export default LineChartExample