import { ActivityIndicator ,View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Animated, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity, Dimensions, Platform, TextInput} from 'react-native'
import React, {useState, useEffect, useContext } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import Info from '../Components/Info'
import {ref, set, update, onValue} from "firebase/database"
import { collection, getDocs} from "firebase/firestore";
import { db_realtime, db_firestore } from "../firebase"
import { auth } from '../firebase';
import { signOut } from "firebase/auth"
import { UserContext } from '../UserContext';
import DateTimePicker from "react-native-modal-datetime-picker"
import moment from "moment"
import Toast from 'react-native-root-toast';
import CircleLoader from '../Components/CircleLoader';
import ConfirmationLoader from '../Components/ConfirmationLoader';

const platform  = Platform.OS === "ios"; 
const platformAndroid = Platform.OS === "android" 
const PlatformWeb = Platform.OS === "web"

const HEIGHT100 = Dimensions.get("screen").height - 100 ;

const Check_Notification = ({navigation}) => {


   const { emailProvider,setEmailProvider, userCredentials, setUserCredentials }  = useContext(UserContext);

   const [date, setDate] = useState(new Date()); 
   const [openDatePicker, setOpenDatePicker] = useState(false);
   const [textDate, setTextDate] = useState("");
   const [textTime, setTextTime] = useState(""); 

   const [showOptions , setShowOptions] = useState(false);

   const [location, setLocation] = useState(""); 
   const [speaker, setSpeaker] = useState(""); 

    const [users, setUsers] = useState([]);
    // const [showspeech, setShowspeech] = useState(false);
    const [num, setNum] = useState(0)
    const [showFilter, setShowFilter] = useState(false);
    const [showMostRecent, setShowMostRecent] = useState([]);
    const [showTime, setShowTime] = useState([]);
    const [showDate, setShowDate] = useState([]);
    const [showSpeaker, setShowSpeaker] = useState([]);
    const [showLocation, setShowLocation] = useState([]);
    const [showFilterData, setShowFilterData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const [loadingPending, setLoadingPending] = useState(false); 

    useEffect(() => { 
      // setLoadingPending(true);  
      if(emailProvider=="" || emailProvider==null){
        navigation.replace("Login");
      }
      else{
        setUsers([]);
        
        setLoadingPending(true);
        setTimeout(()=>{
          setLoadingPending(false);
        }, 500);

        onValue(ref(db_realtime), snapshot =>{
          const data = snapshot.val(); 
          if (data!=null){
              Object.values(data).map(user =>{
                  setUsers((oldArray) => [user, ...oldArray]);
              });
          }
        });
      }
        //  let timer1 = setTimeout(() => setLoadingPending(true), 10 * 1000);

        //  setLoadingPending(false);

      // return () => {
      //   clearTimeout(timer1);
      // };
    }, []);



      // const onChangeDate = (event, selectedDate) => {
      //   const currentDate = selectedDate || date; 
      //   setShowDate(Platform.OS === "ios");
      //   setDate(currentDate); 

      //   let tempDate = new Date(currentDate); 
      //   let fdate = tempDate.getDate()+ "-"+ (tempDate.getMonth()+1) + "-" + tempDate.getFullYear(); 
      //   // let ftime = "Hours: " + tempDate.getHours() + " | Minutes" + tempDate.getMinutes(); 
      //   setTextDate(fdate);
      //   // alert(fdate); 
      // }
      // const onChangeTime = (event, selectedDate) => {
      //   setDate(new Date());
      //   const currentDate = selectedDate || date; 
      //   setShowDate(Platform.OS === "ios");
      //   setDate(currentDate); 

      //   let tempDate = new Date(currentDate); 
      //   // let fdate = tempDate.getDate()+ "-"+ (tempDate.getMonth()+1) + "-" + tempDate.getFullYear(); 
      //   let ftime =tempDate.getHours() + ":" + tempDate.getMinutes(); 
        
      //   setTextTime(ftime);
      //   // alert(ftime); 
      // }

      // const showDatePicker = () => {
      //   setOpenDatePicker(true);
      // };



    const getDataFire = async () =>{
      const userData = collection(db_firestore, "User_Data"); 
      const userDataSnapshot = await getDocs(userData); 
      const userDataList = userDataSnapshot.docs.map(
          doc => doc.data()); 
      
    
      userDataList.map(item=>{
          if(item.Email.toLowerCase() == emailProvider.toLowerCase()){
            // alert("Something is off ");
            setUserCredentials({
              "Username" : item.Username, 
              "Email" : item.Email, 
              "Password": item.Password, 
              "Device" : item.Device, 
              "Phone" : item.Phone, 
              "Location" : item.Location,
            });
          }  
      });
    }

    const [selectedOptions, setSelectedOptions] = useState(5);
    const selectOptions = [
      {key:5, value:5}, 
      {key:10, value:10}, 
      {key:15, value:15}, 

    ]

    
     useEffect(() => {
      setShowFilterData([]);
       if (selectedOptions > users?.length){
          Object.values(users).map(item =>{
                  setShowFilterData((oldArray) => [...oldArray, item]);
              });
        }
        else{
          Object.values(users).map((item,index) =>{
              if (index<selectedOptions){
                 setShowFilterData((oldArray) => [...oldArray, item]) 
              }
              });
        }
    }, [selectedOptions]);

    
    const [isVisibleDatePicker, setIsVisibleDatePicker] = useState(false);

    // ---------------------------------------------------------------------------
    /// Handle Filter 
    // ---------------------------------------------------------------------------

    const [loadingFilterPending, setLoadingFilterPending] = useState(false); 

    const handleFilter = (id) =>{
      setNum(id);
      if (id==2){
        setIsVisibleDatePicker(true);
      }
      if (id==3){
        setIsVisibleTimePicker(true);
      }

      setShowFilter(false);
      setShowFilterData([]);
      
      if (id === 1) {
        // alert(selectedOptions);
        setLoadingFilterPending(true);
        setTimeout(()=>{
            setLoadingFilterPending(false);
        }, 500);

        if (selectedOptions > users?.length){
          Object.values(users).map(item =>{
                  setShowFilterData((oldArray) => [...oldArray, item]);
              });
        }
        else{
          Object.values(users).map((item,index) =>{
              if (index<selectedOptions){
                 setShowFilterData((oldArray) => [...oldArray, item]) 
              }
              });
        }
      }
      console.log(id); 
      // console.log(showFilterData);
    }

    
    const handleSpeaker = (text)=>{
      setSpeaker(text); 
      setLoadingFilterPending(true);
      setTimeout(()=>{
          setLoadingFilterPending(false);
      }, 500);

      setShowFilterData([]);
      Object.values(users).map(item=>{
        if (item.Speaker.toLowerCase().includes(speaker?.toLowerCase())){
            setShowFilterData((oldArray) => [...oldArray, item]) 
        }
      });
    };


    const handleLocation = (text)=>{
      setLocation(text); 

      setLoadingFilterPending(true);
      setTimeout(()=>{
          setLoadingFilterPending(false);
      }, 500);

      setShowFilterData([]);
      if (location != "" || location != null){
        Object.values(users).map(item=>{
          if (item.Location.toLowerCase().includes(location?.toLowerCase())){
              setShowFilterData((oldArray) => [...oldArray, item]) 
          }
        });
      }
    }; 


    const handleDatePicker = (selectedDate)=>{
      let fDate = moment(selectedDate).format("YYYY-MM-DD")
      // console.warn("A date has been picked ", fDate); 
      setTextDate(moment(fDate).format("DD MMMM, YYYY")); 

      setLoadingFilterPending(true);
      setTimeout(()=>{
          setLoadingFilterPending(false);
      }, 500);


      setShowFilterData([]);

      Object.values(users).map(item=>{        
        if (item.Date.includes(fDate)){
            setShowFilterData((oldArray) => [...oldArray, item]) 
        }
      });
      hideDatePicker();
    }
    const hideDatePicker = ()=>{
      setIsVisibleDatePicker(false);
    }

    const [isVisibleTimePicker, setIsVisibleTimePicker] = useState(false);

    const handleTimePicker = (selectedTime)=>{
      let fTime = moment(selectedTime).format("HH:mm")
      // console.warn("A date has been picked ", fTime); 
      // console.log("Time: " , selectedTime); 
      setTextTime(fTime);

      setLoadingFilterPending(true);
      setTimeout(()=>{
          setLoadingFilterPending(false);
      }, 500);


      setShowFilterData([]);

      Object.values(users).map(item=>{
        if (item.Time.includes(fTime)){
            setShowFilterData((oldArray) => [...oldArray, item]) 
        }
      });
      hideTimePicker();
    }
    const hideTimePicker = ()=>{
      setIsVisibleTimePicker(false);
    };

    const handleSignOut = ()=>{
      setShowOptions(false);
      signOut(auth)
      .then((re)=>{
        Toast.show('Signed Out Successfully!', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.TOP,
            containerStyle:{backgroundColor:"blue",borderRadius:25, padding:10, marginTop:10}
          });
        setUserCredentials({
            "Username" : null, 
            "Email" : null, 
            "Password": null, 
            "Device" : null, 
            "Phone" : null, 
            "Location" : null,
        });
        setEmailProvider(""); 
        navigation.replace('Login');
      })
      .catch((error)=>{
        alert(error.message); 
      })
        
    }; 

    const pullUpData = ()=>{
      setRefresh(true); 

      setUsers([]);
      setTimeout(()=>{
            setRefresh(false);
        },1000);
      
      onValue(ref(db_realtime), snapshot =>{
        const data = snapshot.val(); 
        if (data!=null){
            Object.values(data).map(user =>{
                setUsers((oldArray) => [user, ...oldArray]);
            });
        }
      });
    }


  
  
  const scrollY = React.useRef(new Animated.Value(0)).current; 
  const ITEM_SIZE = 240;
     
    // const create = ()=>{
    //   set(ref(db_realtime, 'users/'), {
    //     username:"df", 
    //     email:"df@gmail.com"
    //   }).then(()=>{
    //     alert("data updated");
    //   }).catch((error)=>{
    //     alert(error);
    //   });
    // }

  return (
    <>
    <SafeAreaView style={styles.checkNotificationContainer}> 
      <Image 
        source={require('../assets/child_app.jpeg')} 
        style = {StyleSheet.absoluteFillObject}
        blurRadius={80}
      />       
      <View style={{flex:1, width:"100%", maxHeight:65, minHeight:65, zIndex:100, flexDirection:"row", justifyContent:"space-between", marginTop:5, marginBottom:5, padding:5}}>
        <View style={{flexDirection:"row"}}>
        <TouchableOpacity 
          style={{flexDirection:"row", padding:5, marginLeft:10, marginTop:12, justifyContent:"flex-start"}}
          onPress={()=>navigation.navigate('Menu')}>
          <Icon name= {'chevron-back-sharp'} size={40} color={'rgba(30, 32, 255, 0.8)'} /> 
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={()=> setShowFilter(!showFilter)}
          >
          <FontAwesome name={'filter'} size={16} color={'white'} style={{padding:3}} />
          <Text style={{fontSize:15, fontWeight:"bold", color:"white", padding: platform ? 3 : 0, justifyContent:"center"}}>Filter</Text>
        </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.headerMenu}>
        <TouchableOpacity onPress={()=> setShowOptions(!showOptions)}>
            <View style={{flexDirection:"row", justifyContent:"center"}}>
              <FontAwesome name={'user-circle'} size={25} color={'rgba(0, 0, 255, 0.7)'}  style={styles.userIcon}/>
              <FontAwesome5 name={'chevron-right'} size={18} color={'rgba(0, 0, 255, 0.7)'}  style={[styles.userIcon, showOptions? {transform:[{rotate:"90deg"}], paddingLeft:6} : null]}/>
            </View>
            <Text style={styles.headerText}> {userCredentials.Username}</Text>               
        </TouchableOpacity>    
      </SafeAreaView>
      </View>
      <View style={{position:"absolute", backgroundColor:"lightblue", top:100, right:10, zIndex:1, justifyContent:"center"}}>
        { showOptions ? 
                <View style={{borderRadius:7, borderWidth:2, borderColor:"white", padding:8 }}>
                    <TouchableOpacity 
                    style={{flexDirection:"row", padding:5, borderBottomWidth:2, borderBottomColor:"white"}}
                    onPress={()=>{ 
                        navigation.push("Profile"); 
                        setShowOptions(false);
                    }}>
                        <FontAwesome5 name={'user-edit'} size={20} color={'rgba(0, 0, 255, 0.7)'}  style={{padding:2}}/>             
                        <Text style={{paddingTop:2, paddingLeft:5,justifyContent:"center", fontSize:15, fontWeight:"500" }}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection:"row", padding:5}}
                    onPress={handleSignOut}>
                        <Icon name={'log-out'} size={20} color={'rgba(0, 0, 255, 0.7)'}  style={{padding:2}}/>             
                        <Text  style={{paddingTop:2, paddingLeft:5, justifyContent:"center", fontSize:15, fontWeight:"500" }}>Sign Out</Text>
                    </TouchableOpacity>
                </View> : null 
            } 
        </View>
      <View style={{maxHeight:200, zIndex:100, borderRadius:15, marginLeft:20, marginRight:15}}>
      { showFilter ? 
        <View style={styles.filterOptions}>
          <TouchableOpacity onPress={() => handleFilter(0)}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilter(1)}>
            <Text style={styles.filterText}>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => handleFilter(2)}>
            <Text style={styles.filterText}>Date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => handleFilter(3)}>
            <Text style={styles.filterText}>Time</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilter(4)}>
            <Text style={styles.filterText}>Speaker</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> handleFilter(5)}>
            <Text style={styles.filterText}>Location</Text>
          </TouchableOpacity>
          
        </View> 
        : 
        null
      }
      </View>
      { 
      num === 1 && !showFilter ?
        <View style={[styles.calendarComponent, {zIndex:1, justifyContent:"space-between", paddingHorizontal:5}]}>
          <Text style={{fontSize:15, fontWeight:"500", padding:2, paddingHorizontal:15, marginTop:0, marginBottom:3, justifyContent:"center"}}>
            Latest (5)
           </Text>
          {/* <View>
          <SelectList 
            data={selectOptions}
            setSelected={setSelectedOptions}
            dropdownStyles={{backgroundColor:"lightblue"}}
            inputStyles={{fontSize:13, color:"black", fontWeight:"500", justifyContent:"center", marginTop:5, paddingHorizontal:8}}
            boxStyles={{width:200, height:30, margin:0, padding:0, borderWidth:0.5, borderColor:"dodgerblue"}}
            placeholder={"5"}            
          />   
          </View>   */}
          {/* <Text style={{fontSize:16, fontWeight:"700", width:200, height:50}}>{selectedOptions}</Text>      */}
        </View>
        :
      num === 2 && !showFilter ? 
         <View style={styles.calendarComponent}>
          <TouchableOpacity style={{width:"100%", flexDirection:"row"}}
           onPress={()=>setIsVisibleDatePicker(true)}>
          <Icon name={'calendar'} size={28} color={'rgba(0,0,0, 0.7)'}  style={{marginLeft:15, marginBottom:4}}/>

            {/* <DateTimePicker 
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                display="default"
                onTouchCancel={true}
                onChange={(selectedDate)=> onChangeDate(selectedDate)}
              /> */}              
            <Text style={{fontSize:15, fontWeight:"500", paddingHorizontal:10, paddingTop:4, marginTop:0, marginBottom:6,textAlignVertical:"center", justifyContent:"center"}}>
             {textDate}
            </Text>
          </TouchableOpacity>
            
          <DateTimePicker
                isVisible={isVisibleDatePicker}
                onConfirm={handleDatePicker}
                onCancel={hideDatePicker}
                mode={"date"}
                isDarkModeEnabled={true}
              />        
        </View>
        :
      num === 3 && !showFilter ? 
        <View style={styles.calendarComponent}>
          <TouchableOpacity style={{width:"100%",flexDirection:"row"}} 
           onPress={()=>setIsVisibleTimePicker(true)}>
            <Icon name={'time'} size={28} color={'rgba(0,0,0, 0.7)'}  style={{marginLeft:15, marginBottom:3}}/>
            {/* <DateTimePicker 
                testID="dateTimePicker"
                value={date}
                mode={"time"}
                display="clock"
                onChange={(selectedDate)=>onChangeTime(selectedDate)}
              /> */}
            <Text style={{fontSize:15, fontWeight:"500", paddingHorizontal:10, paddingTop:4, marginTop:0, marginBottom:7, textAlignVertical:"center", justifyContent:"center"}}>
              {textTime}
            </Text>
              
          </TouchableOpacity>
          
          <DateTimePicker
                isVisible={isVisibleTimePicker}
                onConfirm={handleTimePicker}
                onCancel={hideTimePicker}
                mode={"time"}
                isDarkModeEnabled={true}
              />
                   
        </View>
        :
      num === 4 && !showFilter ? 
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()} > 
        <View>
          <MaterialIcons name={'account-voice'} size={22} color={'rgba(0,0,0, 0.7)'}  style={styles.inputIcon}/>
          <TextInput 
                placeholder = {'Speaker'}
                placeholderTextColor={'rgba(0,0,0, 0.4)'}
                style= {[styles.input]}               
                underlineColorAndroid='transparent'
                value={speaker}
                onChangeText={handleSpeaker}
                keyboardType="ascii-capable"
                selectTextOnFocus
                >                
          </TextInput>
          {/* <Text style={{fontSize:15}}>{speaker}</Text> */}
        </View> 
        </TouchableWithoutFeedback>
        :
      num === 5  && !showFilter ? 
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()} > 
        <View>
          <Icon name={'md-location-sharp'} size={22} color={'rgba(0,0,0, 0.7)'}  style={styles.inputIcon}/>
          <TextInput 
                placeholder = {'Location'}
                placeholderTextColor={'rgba(0,0,0, 0.4)'}
                style= {[styles.input]}               
                underlineColorAndroid='transparent'
                value={location}
                onChangeText={handleLocation}
                keyboardType="ascii-capable"
                selectTextOnFocus 
                >                
            </TextInput>
        </View>
        </TouchableWithoutFeedback>
        : null    
      }
      
        {/* {num==2 ? 
          <Text style={styles.filterOptionsHeader}>
             {textTime}
          </Text>  : null} */}

      <Animated.FlatList       
        refreshControl={
          <RefreshControl
          refreshing={refresh}
          onRefresh={pullUpData}
          colors={['blue']}
          tintColor={'blue'} />
         }  
        showsHorizontalScrollIndicator={false}
        data={num===0 ? users : showFilterData}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}], 
          {useNativeDriver: true}
        )}
        keyExtractor={item => item.key}
        renderItem = {({item, index}) => {
          const inputRange = [
            -1, 
            0, 
            ITEM_SIZE * index, 
            ITEM_SIZE * (index + 2)
          ];

          const scale = scrollY.interpolate({
            inputRange:inputRange, 
            outputRange: [1, 1, 1, 0]
          })

          
          
          return (
            <Info 
              scale = {scale}
              speaker = {item.Speaker} 
              date = {moment(item.Date).format("DD MMMM, YYYY")} 
              time = {item.Time}
              location = {item.Location}
              speech = {item.Speech}
            />
          )
          
          // <Animated.View             
          //   style={[styles.infoContainer, {transform:[{scale}]}]}
          //   >
          //   <View style= {styles.info}>
          //       <Text style= {styles.infoTitle}> Date:</Text>
          //       <Text style= {styles.infoText}> {item.Date} </Text>
          //   </View>
          //   <View style= {styles.info}>
          //       <Text style= {styles.infoTitle}> Time:</Text>
          //       <Text style= {styles.infoText}> {item.Time} </Text>
          //   </View>
          //   <View style= {styles.info}>
          //       <Text style= {styles.infoTitle}> Speaker:</Text>
          //       <Text style= {styles.infoText}> {item.Speaker} </Text>
          //   </View>
          //   <View style= {styles.info}>
          //       <Text style= {styles.infoTitle}> Location:</Text>
          //       <Text style= {styles.infoText}> {item.Location} </Text>
          //   </View>
            
          //   <TouchableOpacity style= {styles.info} >
          //       <Text style= {[styles.infoTitle , styles.infoSpeech]} onPress={handleShowSpeech}> Speech:</Text>
          //     { showspeech == true ?
          //       <Text style= {styles.infoText}> {item.Speech}</Text> : 
          //       <Text style= {styles.infoText}></Text>
          //     } 
          //   </TouchableOpacity>      
          // </Animated.View>
          
        }}
      />

       
    
      
        {/* { users?.map(user =>(
            <Info 
                speaker={user.Speaker}
                location={user.Location}
                speech={user.Speech}
                time={user.Time}
                date={user.Date}
                />
        ))
     
        } */}


    </SafeAreaView >
      {/* {loadingPending? <CircleLoader/>: null} */}
      {loadingPending || loadingFilterPending? 
        <View style={[styles.loadingView, loadingFilterPending ? {width:"100%", height:100, justifyContent:"center"}: null]}>
            <ActivityIndicator size={"large"} color="blue" animating={true}/> 
        </View>
        : null 
      }
    </>
  )
}

export default Check_Notification;


const styles = StyleSheet.create({
    checkNotificationContainer:{
        height: "100%", 
        width: "100%",
        backgroundColor:"lightblue",
        padding:10,
        justifyContent:"flex-start",
        textAlignVertical: 'top',
        // alignItems:"baseline",
        // shadowColor:"#000", 
        // shadowOffset: {
        //     width: 0,
        //     height:10,
        // },
        // shadowOpacity:1,
        // shadowRadius:20,
    },   
    filterOptionsHeader:{
      zIndex:0,
      padding:8,
      maringBottom:10, 
      marginTop:3,
      color:"blue", 
      opacity: 0.8,
      marginLeft:15, 
      fontSize:18, 
      fontWeight:"bold",
      fontStyle:"italic",
      height: 50,
      flexDirection:"row",
      // borderWidth:5, 
      // borderColor: "lightblue",
      // borderBottomColor:"white",
      // borderBottomLeftRadius: 10,
      // borderBottomRightRadius:10,
      maxWidth:150,
      // backgroundColor:"red",
      },
    
    inputIcon:{
      position:'absolute', 
      top:15, 
      left:40, 
    
    },

    input:{
      height:35, 
      borderRadius: 10, 
      fontSize:15, 
      padding: 5,
      paddingLeft:45, 
      backgroundColor:'rgba(30, 144, 255, 0.2)', 
      textAlignVertical: 'center',
      color : 'black', 
      borderWidth:1,
      borderColor:'gray',
      margin: 10,
      marginLeft:25, 
      marginRight:25,   
      fontWeight:"500",
      fontSize:12,
      shadowColor:"gray", 
      shadowOffset:{
          width:0, 
          height:10
      }, 
      shadowOpacity:0.5,
      shadowRadius:20,
    },

    filterOptions:{
      // zIndex:100,
      flexDirection:"row",  
      flexWrap:"wrap", 
      flex:1,
      minHeight:200,
      paddingHorizontal:20, 
      padding:10, 
      // backgroundColor:"white",
      // // padding:10, 
      // // paddingHorizontal:15,
      // // marginLeft:10,
      // // marginRight:10,
      // // backgroundColor:"white",
      // borderWidth:2,
      // borderColor:"white",
      // borderRadius:15, 
      // shadowColor:"gray", 
      // shadowOffset:{
      //     width:0, 
      //     height:10
      // }, 
      // shadowOpacity:0.5,
      // shadowRadius:20, 
    }, 

    filterText:{
      fontSize:13, 
      backgroundColor:"dodgerblue",
      fontWeight:"bold", 
      padding:10,
      paddingHorizontal:15,
      borderWidth:1.5,
      borderColor:"white",
      color:"white",
      
    },
    filterBtn:{
      flexDirection:"row", 
      padding:5, 
      margin:8,
      marginLeft:14,
      marginRight:14,
      backgroundColor:"dodgerblue", 
      width:80,
      height:40,
      justifyContent:"flex-end", 
      alignItems:"center", 
      // shadowColor:"gray", 
      // shadowOffset:{width:0, height:10}, 
      // shadowOpacity:0.5, 
      // shadowRadius:30, 
      borderColor:"white",
      borderWidth:2, 
      borderRadius: 15,
      marginTop:20,
    }, 
    calendarComponent:{
      flexDirection:"row",
      maxHeight:50,
      marginTop:10, 
      paddingTop:5,
      backgroundColor:'rgba(30, 144, 255, 0.2)', 
      textAlignVertical: 'center',
      color : 'black', 
      borderWidth:1,
      borderColor:'gray',
      borderRadius:10,
      marginLeft:25, 
      marginRight:25,   
      fontWeight:"500",
      shadowColor:"gray", 
      shadowOffset:{
          width:0, 
          height:10
      }, 
      shadowOpacity:0.5,
      shadowRadius:20,
    },
    headerMenu:{
        flex:1,
        position: 'absolute',
        marginTop:7, 
        right:0,
        top:12,
        justifyContent:"center",
        alignItems:"center",
        paddingRight:4,
        marginRight:5,
        
      },  
    headerText:{
        color:"black",
        opacity: 0.7,
        fontSize:15, 
        fontWeight:'bold', 
        alignItems:"center",
        paddingRight:10,
        margin:0,
        textTransform:"capitalize"

    }, 
    userIcon:{
        alignItems:"center",
        justifyContent:"center",
        margin:0,
        marginTop:2,
        paddingLeft:3,
        alignSelf:"center",
    },
    loadingView:{
      marginTop:140,
      position:"absolute",
      justifyContent:"center",
      zIndex:1,
      width:"100%",
      height:500, 
    }
})