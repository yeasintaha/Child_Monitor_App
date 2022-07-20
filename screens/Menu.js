import { SafeAreaView,View, ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Linking, Alert, BackHandler, RefreshControl} from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
import { UserContext } from '../UserContext'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import { auth, db_firestore } from '../firebase';
import { doc, setDoc, getDoc, collection, getDocs} from "firebase/firestore";
import { signOut } from "firebase/auth"
import moment from 'moment';


const {width:WIDTH} = Dimensions.get('screen').width

const Menu = ({navigation}) => {

    const {userCredentials, setUserCredentials, setEmailProvider} = useContext(UserContext); 
    const [showOptions, setShowOptions] = useState(false); 

    const [deviceStatus, setDeviceStatus] = useState(true); 
    const [deviceConnectionDate, setDeviceConnectionDate] = useState(""); 
    const [deviceConnectionTime, setDeviceConnectionTime] = useState(""); 
    const [locationDevice, setLocationDevice] = useState(""); 
    const [connectedText, setConnectedText] = useState("");
    const [refresh, setRefresh]  = useState(false);



    useEffect(() => {
        setShowOptions(false);
        BackHandler.addEventListener('hardwareBackPress', ()=> true)
        
        const deviceDoc = doc(db_firestore, "Activation", "Datetime")        
        getDoc(deviceDoc)
        .then((snapshot)=>{
             setDeviceConnectionDate(moment(snapshot.data().Date).format("DD MMMM, YYYY")); 
            // let ftime= moment(snapshot.data().Time).format("HH:mm")
            setDeviceConnectionTime(snapshot.data().Time.split(":")[0]+":" + snapshot.data().Time.split(":")[1]); 

            var today = new Date();

            var fdate = today.getFullYear()+ '-' +
                ((today.getMonth()+1) < 10 ? ("0"+(today.getMonth()+1)): today.getMonth()+1)
                +'-'+(today.getDate())
            
            let hour = today.getHours().toString();
            let min = today.getMinutes().toString();
            // alert(fdate)

            // Device Date and Time 
            let deviceTime = snapshot.data().Time.split(':'); 
            let deviceDate = snapshot.data().Date;
            if (fdate == deviceDate && parseInt(hour) == parseInt(deviceTime[0]) && parseInt(min) <= (parseInt(deviceTime[1]))){
                setDeviceStatus(true); 
            }
            else{
                setDeviceStatus(false); 
            }

            if (fdate == deviceDate){
                setConnectedText("Today");
            }
            else if (((parseInt(fdate.split("-")[2]) - 1) == parseInt(deviceDate.split("-")[2])) 
                && fdate.split("-")[0] == deviceDate.split("-")[0] && fdate.split("-")[1] == deviceDate.split("-")[1]){
                    setConnectedText("Yesterday"); 
            }
            else{
                setConnectedText(moment(snapshot.data().Date).format("DD MMMM, YYYY").toString()); 
            }
        })
        .catch((error)=>{
            alert(error.message); 
        });

        const locationDoc = doc(db_firestore, "Get_Location", "Realtime")        
        getDoc(locationDoc)
        .then((snapshot)=>{
            setLocationDevice(snapshot.data().Longitude + "," + snapshot.data().Latitude); 
        })
        .catch((error)=>{
            alert(error.message); 
        });


        return  ()=>{
            BackHandler.addEventListener('hardwareBackPress', ()=> true);
        }

        
    }, []);

    // useEffect(() => {
    //     const deviceDoc = doc(db_firestore, "Activation", "Datetime")        
    //         getDoc(deviceDoc)
    //         .then((snapshot)=>{
    //             setDeviceConnectionDate(snapshot.data().Date); 
    //             // let ftime= moment(snapshot.data().Time).format("HH:mm")
    //             setDeviceConnectionTime(snapshot.data().Time); 

    //             let current_date = new Date();
    //             let date_today = current_date.getDate();
    //             let fdate = moment(date_today).format("YYYY-MM-DD") ; 
    //             let hour = current_date.getHours();
    //             let min = current_date.getMinutes();
    //             let deviceTime = snapshot.data().Time.split(':'); 
    //             let deviceDate = snapshot.data().Date;
    //             if (fdate == deviceDate && hour== deviceTime[0] && parseInt(min) <= (parseInt(deviceTime[1])+2)){
    //                 setDeviceStatus(true); 
    //             }
    //             else{
    //                 setDeviceStatus(false); 
    //             }

    //         })
    //         .catch((error)=>{
    //             alert(error.message); 
    //         });
        
    // }, [deviceConnectionDate, deviceConnectionTime]);


    const refreshDevice = ()=>{
        setRefresh(true); 
        const deviceDoc = doc(db_firestore, "Activation", "Datetime")        
        getDoc(deviceDoc)
        .then((snapshot)=>{
            setDeviceConnectionDate(moment(snapshot.data().Date).format("DD MMMM, YYYY")); 
            // let ftime= moment(snapshot.data().Time).format("HH:mm")
            setDeviceConnectionTime(snapshot.data().Time.split(":")[0]+":" + snapshot.data().Time.split(":")[1]); 

            var today = new Date();

            var fdate = today.getFullYear()+ '-' +
                ((today.getMonth()+1) < 10 ? ("0"+(today.getMonth()+1)): today.getMonth()+1)
                +'-'+(today.getDate())
            
            let hour = today.getHours().toString();
            let min = today.getMinutes().toString();
            // alert(fdate)

            // Device Date and Time 
            let deviceTime = snapshot.data().Time.split(':'); 
            let deviceDate = snapshot.data().Date;
            if (fdate == deviceDate && parseInt(hour) == parseInt(deviceTime[0]) && parseInt(min) <= (parseInt(deviceTime[1]))){
                setDeviceStatus(true); 
            }
            else{
                setDeviceStatus(false); 
            }

            if (fdate == deviceDate){
                setConnectedText("Today");
            }
            else if (((parseInt(fdate.split("-")[2]) - 1) == parseInt(deviceDate.split("-")[2])) 
                && fdate.split("-")[0] == deviceDate.split("-")[0] && fdate.split("-")[1] == deviceDate.split("-")[1]){
                    setConnectedText("Yesterday"); 
            }
            else{
                setConnectedText(deviceConnectionDate); 
            }

            

        })
        .catch((error)=>{
            alert(error.message); 
        });

        const locationDoc = doc(db_firestore, "Get_Location", "Realtime")        
        getDoc(locationDoc)
        .then((snapshot)=>{
            setLocationDevice(snapshot.data().Longitude + "," + snapshot.data().Latitude); 
        })
        .catch((error)=>{
            alert(error.message); 
        });

        // 23.83775935439258, 90.35792388650765
        

        setTimeout(()=>{
            setRefresh(false);
        },1000);
    }

    const handleSignOut = ()=>{
    
      setShowOptions(false);
      signOut(auth)
      .then((re)=>{
        Toast.show('Signed Out Successfully!', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.TOP,
            containerStyle:{backgroundColor:"blue",borderRadius:25, padding:10}
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
        navigation.replace('Login')
      })
      .catch((error)=>{
        alert(error.message); 
      })
        
    }
    
    // useEffect(() => {
    //     alert(userCredentials.Username + " " + userCredentials.Email + " " + userCredentials.Location + " "+ userCredentials.Phone + " " + userCredentials.Device + " " + userCredentials.Password);
    // }, []);

  return (
    <SafeAreaView 
    style={styles.menuContainer}
    >
    <ScrollView 
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    refreshControl={
        <RefreshControl
        colors={['blue']}
        tintColor={'blue'}
        refreshing={refresh}
        onRefresh={refreshDevice} />
    }
    >
        <SafeAreaView style={styles.headerMenu}>
            <TouchableOpacity onPress={()=> setShowOptions(!showOptions)}>
                <View style={{flexDirection:"row", justifyContent:"center"}}>
                    <FontAwesome name={'user-circle'} size={25} color={'rgba(0, 0, 255, 0.7)'}  style={styles.userIcon}/>
                    <FontAwesome5 name={'chevron-right'} size={18} color={'rgba(0, 0, 255, 0.7)'}  style={[styles.userIcon, showOptions? {transform:[{rotate:"90deg"}], paddingLeft:6} : null]}/>
                </View>
                <Text style={styles.headerText}> {userCredentials.Username}</Text>               
            </TouchableOpacity>   
        </SafeAreaView>
        <View style={{position:"absolute", backgroundColor:"lightblue", top:85, right:10, zIndex:1, justifyContent:"center"}}>
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
        <TouchableOpacity style = {[styles.checkNotification]}>
            <View style={[styles.notificationIcon,{margin:10, width:26, height:26, borderRadius:16, shadowColor:"rgba(255, 0, 0, 0.3)", shadowOffset: {width: 0, height:5},
                 shadowOpacity:1, shadowRadius:20,}, deviceStatus? {backgroundColor:"green", shadowColor:"green"} : {backgroundColor:"red" , shadowColor:"rgba(255, 0, 0, 0.3)"}]} >
            </View>
            <View>
                {deviceStatus ?
                <Text style={[styles.notificationText, {flexDirection:"column", marginLeft:0, paddingLeft:5}]}>  Device Status: Connected </Text> : 
                <Text style={[styles.notificationText, {flexDirection:"column", marginLeft:0, paddingLeft:5}]}> Device Status: Not Connected </Text>
                }
                {!deviceStatus ? 
                <View style={{flexDirection:"row", width:"80%"}}>
                    <Text style={{marginLeft:10, marginBottom:5, fontSize:13, fontWeight:"500", color:"black", opacity:0.5}}>
                        Last Connection:
                    </Text> 
                    <Text style={{marginLeft:4, marginBottom:5, marginRight:100, fontSize:13, fontWeight:"500", color:"black", opacity:0.5}}> 
                        {connectedText}, {deviceConnectionTime} 
                    </Text>
                </View> : null 
                } 
            </View>
        </TouchableOpacity>
        <TouchableOpacity style = {[styles.checkNotification, {marginTop:15}]}  onPress={()=>navigation.navigate('Check_Notification')}>
            <Image source={require("../assets/notification.png")} style={styles.notificationIcon} />
            <Text style={styles.notificationText}> Check Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity   style = {styles.trackLocation} onPress={()=>{
            Linking.openURL(`https://www.google.com/maps/dir/${userCredentials.Location}/${locationDevice}`)
        }}>
            <Image source={require("../assets/location.png")} style={styles.notificationIcon} />
            <Text style={styles.notificationText}> Track Location</Text>
        </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  )
}

export default Menu

const styles = StyleSheet.create({
    menuContainer:{
        backgroundColor:"lightblue", 
        width: "100%",
        height: "100%"        
    },
    headerMenu:{
        flex:1,
        position: 'absolute',
        marginTop:12, 
        right:0,
        top:14,
        justifyContent:"center",
        alignItems:"center",
        paddingRight:4,
        marginRight:4,
        
      },  
    headerText:{
        color:"black",
        opacity: 0.7,
        fontSize:15, 
        fontWeight:'bold', 
        alignItems:"center",
        paddingRight:10,
        margin:0,
        textTransform:"capitalize",
        paddingTop:3,
    }, 
    userIcon:{
        alignItems:"center",
        justifyContent:"center",
        margin:0,
        marginTop:2,
        paddingLeft:3,
        alignSelf:"center",
    },
    notificationIcon:{
        width: 50, 
        height: 50,
        borderRadius:25,
    },  
    checkNotification:{
        flexDirection:"row",
        alignContent:"center", 
        alignItems:"center",
        marginTop:100,
        padding:10, 
        margin:10, 
        backgroundColor:"rgba(254, 254, 254, 0.5)", 
        border:"2px solid white", 
        borderRadius: 10,   
        // boxShadow: '5px 10px gray',
        shadowColor:"gray", 
        shadowOffset: {
            width: 0,
            height:10,
        },
        shadowOpacity:1,
        shadowRadius:20,
    },
    
    notificationText:{
        fontSize:15, 
        fontWeight:"bold", 
        color:'black',
        opacity: 0.5,
        padding:10, 
    },  
    trackLocation:{
        flexDirection:"row",
        alignContent:"center", 
        alignItems:"center",
        padding:10, 
        backgroundColor:"rgba(254, 254, 254, 0.5)", 
        border:"2px solid white", 
        borderRadius:10,   
        margin:10,
        // boxShadow: '5px 10px gray',
        shadowColor:"gray", 
        shadowOffset: {
            width: 0,
            height:10,
        },
        shadowOpacity:1,
        shadowRadius:20,
    }
})
