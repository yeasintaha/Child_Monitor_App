import { StatusBar } from 'expo-status-bar';
import "react-native-gesture-handler"
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Menu from './screens/Menu';
import Check_Notification from './screens/Check_Notification';
import Info from './Components/Info';
import Register from './screens/Register';
import { UserContext } from './UserContext';
import { useState } from 'react';
import Profile from './screens/Profile';
import { RootSiblingParent } from 'react-native-root-siblings';


const Stack = createNativeStackNavigator();

const MyStack = ()=> {

  const [userCredentials, setUserCredentials] = useState({
    "Username" : null, 
    "Email" : null, 
    "Password": null, 
    "Device" : null, 
    "Phone" : null, 
    "Location" : null,     
  }); 

  // const [isSignedIn, setIsSignedIn] = useState(false);

  const [emailProvider, setEmailProvider] = useState("");


  return (
    <UserContext.Provider value={{userCredentials, setUserCredentials, emailProvider, setEmailProvider}}>
      <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
         
         
          {/* <Stack.Screen 
            name='Menu'
            component={Menu}       
            /> */}

          <Stack.Screen 
            name='Login'
            component={Login}       
            />

            <Stack.Screen 
            name='Menu'
            component={Menu}       
            />

            <Stack.Screen 
            name='Check_Notification'
            component={Check_Notification}       
            />
          
            <Stack.Screen 
            name='Profile'
            component={Profile}       
            />
            <Stack.Screen 
            name='Register'
            component={Register}       
            />
            
        </Stack.Navigator>
      </NavigationContainer>
      </RootSiblingParent>
    </UserContext.Provider>
  );
}

export default MyStack; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
