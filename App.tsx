import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';

import CameraScreen from './src/screens/CameraScreen';

import RegistrationScreen from './src/screens/RegistrationScreen';
import RegistrationCameraScreen
from './src/screens/RegistrationCameraScreen';

const Stack =
  createNativeStackNavigator();


function App(): JSX.Element {

  return (

    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
        />

        <Stack.Screen
          name="Camera"
          component={CameraScreen}
        />

        <Stack.Screen
          name="RegistrationCamera"
          component={RegistrationCameraScreen}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;