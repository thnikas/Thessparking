import React,{useState} from 'react'
import { BarChart, XAxis, Grid,YAxis, c} from 'react-native-svg-charts'
import { View, Text, StyleSheet,Button, TouchableOpacity, Dimensions, TouchableHighlight,Switch } from 'react-native'
import {  Line, Rect, Svg, Path} from 'react-native-svg'
import  Ionicons  from 'react-native-vector-icons/Ionicons'; 
import MyView from '../../MyView'




const windowWidth = Dimensions.get('window').width;
const screen=Dimensions.get('screen').width
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

const AppButton = ({ onPress, title }) => (
<View style = {styles.containerButtons}> 
    <TouchableOpacity style={styles.appButtonContainer } >
           
            <Text style={styles.appButtonText}>{title}</Text>
         </TouchableOpacity>
         </View>
)
const changeBackground=()=>{
   styles=StyleSheet.create({
       appButtonContainer:{
           backgroundColor:'#000'
       }
   })

}
    

let a=" M6 100 L6 90 M49 100 L49 90 M92 100 L92 90 M134 100 L134 90 M176 100 L176 90 M218 100 L218 90 M260 100 L260 90"

if(windowWidth>410){
    a="M6 100 L6 90 M57 100 L57 90 M108 100 L108 90 M159 100 L159 90 M210 100 L210 90 M261 100 L261 90 M312 100 L312 90 "
}else if(windowWidth<321){
    a="M6 100 L6 90 M42 100 L42 90 M78 100 L78 90 M114 100 L114 90 M150 100 L150 90 M186 100 L186 90 M222 100 L222 90 "

}else if(windowWidth>390){
    a="M6 100 L6 90 M57 100 L57 90 M100 100 L100 90 M147 100 L147 90 M194 100 L194 90 M241 100 L241 90 M288 100 L288 90 "

}

 const BarChartExample =()=> {
    
    const getSunday = (date) => {
        const dayIndex = date.getDay();
        const diffToLastSunday = (dayIndex !== 0) ? dayIndex : 6;
        return new Date(date.setDate(date.getDate() - diffToLastSunday));
      }
    
      const getSaturday = (sunday) => {
        return moment(sunday).add(6, 'days').toDate();
      }
    
      const [Sunday, setSunday] = useState(getSunday(new Date()));
      const [Saturday, setSaturday] = useState(getSaturday(Sunday));
    
      function changeData() {
        setSunday(moment(Sunday).add(7, 'days').toDate());
        setSaturday(moment(Saturday).add(7, 'days').toDate());
        console.log(Sunday,Saturday)
      }
      function changeData2() {
        setSunday(moment(Sunday).subtract(7, 'days').toDate());
        setSaturday(moment(Saturday).subtract(7, 'days').toDate());
        console.log(Sunday,Saturday)
      }
    
        
        
        
        
       
    
       
        
    
        
        const data3 = [83, 90, 97,  91, 99, 94, 85]
        const data2=[74, 77, 80, 90, 97, 79, 91]
        const data = [ 10,2,5,6,7,9,20]
        const limit=[92]
        const xAxisLabels =  ['ΔΕ','ΤΡ','ΤΕ','ΠΕ','ΠΑ','ΣΑ', 'ΚΥ']
        const ymax=30
        let ymin=0 
        let ticks=3
        let percentPosition=0
        const xAxisHeight =10
        const axesSvg = { fontSize: 15, fill: 'white',fontWeight:'bold' };
        const limitSvg={fontSize:10, fill:'#DC1640'}
        const lineSvg={stroke:'white'}
        const verticalContentInset = { top: 10, bottom: 0 , }
        const verticalContentInsetYLabel={ top: 10, bottom: 10 }    
        const toggleSwitch2 = () => {setIsEnabled2(previousState => !previousState) ,showStatistics()};//used for the second switch
        const [isEnabled2, setIsEnabled2] = useState(false);
        const [isHidden, setHidden]=useState(true)//show-hide the statistics(Must enter the component MyView for this to work)

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
        for(var i = 0; i < data.length; i++) {
            total += data[i];
        }
        var avg = total / data.length;
       avg= parseFloat(avg).toFixed(0);

        //Max
        function getArrayMax(array){
            return Math.max.apply(null, array);
         }
         var maxValue=getArrayMax(data);
        //Min
         function getArrayMin(array){
            return Math.min.apply(null, array);
         }
         var minValue=getArrayMin(data)
        

        return (
            
            <View style={{paddingBottom:20}} backgroundColor='#6CABFD'>


                <View style={{flexDirection:'row', paddingHorizontal:'6%',paddingTop:'5%'}}>
                    <AppButton title="ΕΒΔΟΜΑΔΑ" size="sm" />
                    <AppButton title="ΜΗΝΑΣ" size="sm"/>



                </View>
                
                <View style={{ flexDirection: 'row', alignContent: 'center',  alignItems: 'center', paddingHorizontal:90, paddingBottom:-30}}>
        <Ionicons name="ios-arrow-back" size={30} color="grey" onPress={()=>changeData2()} />
        <Text style={styles.contentDate}>{moment(Sunday).format("DD")}-{moment(Saturday).format("DD MMMM")}</Text>
        <Ionicons name="ios-arrow-forward" size={30} color="grey" onPress={() => changeData()} />
                 </View>

                <View style={{ height: 200, padding:20, flexDirection:'row',   }}>
                <YAxis
                       data={data}
                       min={ymin}
                       max={ymax}
                       style={{  marginBottom: xAxisHeight ,marginRight:'2%'}}
                       contentInset={verticalContentInsetYLabel}
                       svg={axesSvg}
                       
                       numberOfTicks={ticks}
                       formatLabel={(value,index)=>value} 
                    ></YAxis> 
                    <View style={{ flex: 1, marginLeft: 10,position:'relative' }}  >
                    
                        <BarChart
                            yMax={ymax}
                            yMin={ymin}
                            gridMin={0}
                            numberOfTicks={3}
                            style={{ flex: 1 }}
                            data={data}
                            svg={{ fill: '#FFFFFF' }}
                            contentInset={verticalContentInset}
                            spacingInner={0.3}
                            
                        >
                    
                    <Grid svg={lineSvg} belowChart={true}/>    
                               
                        </BarChart >
                                       
                                                       
                        <XAxis 
  style={{marginHorizontal: -15, height:xAxisHeight , paddingHorizontal:10,  marginTop:10,}}
                              data={data}
                            formatLabel={(value, index) => xAxisLabels[index]}
                            contentInset={{ left: 10, right: 10 }}
                            svg={axesSvg}
                            
                            
                        />
                  
                    </View>
                
                   
                    

                </View>
                
                <View>
                <View style={{alignItems:"flex-end", paddingTop:'4%',paddingRight:'3%'}}>
                <Text style={{color:'#ffffff',fontSize:20,fontWeight:'bold'}}>Πατήστε εδώ</Text>
                <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch2}
            value={isEnabled2} 
            />
            
                </View>
                <MyView hide={isHidden}>
                <Text style={styles.text1}> Στατιστικά</Text>
                <View style={{flexDirection:'row',paddingTop:'2%' }}>
                    <Text style={styles.text2}>Ελάχιστο </Text>
                    <Text style={styles.text2}>Μέσος όρος </Text>
                    <Text style={styles.text2}>Μέγιστο </Text> 
                    
                </View>

            
                <View style={{flexDirection:'row' }}>
                    <Text style={styles.text3}>{minValue}</Text>
                    <Text style={styles.text3}> {avg}</Text>
                    <Text style={styles.text3}> {maxValue}</Text> 
                   
                    
                </View>

                </MyView>
               </View>

            </View>
            
           
        )
    }


let styles=StyleSheet.create({
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
    }, container:{ 
        flex: 1 ,
        paddingBottom:0 },
        
    appButtonContainer: {
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
      },
      contentDate:{
        fontSize:15,
        color:'white',
        padding:20,
        
    }      
}
)
export default BarChartExample

/*else if(graphChange==true){
                return(
                  <View style={{ height: 200, padding:20, flexDirection:'row',   }}>
                  <YAxis
                         data={data}
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
                              svg={props.graphLine}
                              contentInset={verticalContentInset}
                              spacingInner={0.3}
                              
                          >
                      
                      <Grid svg={props.lineSvg} belowChart={true}/>    
                                 
                          </BarChart >
                                         
                                                         
                          <XAxis 
    style={{marginHorizontal: -15, height:xAxisHeight , paddingHorizontal:10,  marginTop:10,}}
                                data={pros.data}
                              formatLabel={(value, index) => props.xAxisLabels[index]}
                              contentInset={{ left: 10, right: 10 }}
                              svg={axesSvg}
                              
                              
                          />
                    
                      </View>
                  
                     
                      
  
                  </View>)
                  
            }*/