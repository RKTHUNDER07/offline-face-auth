import React, {useEffect} from 'react';

import {loadEmbeddingModel} from './src/core/embeddings/loadModel';
import {initDatabase} from './src/core/storage/initDatabase';
import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import EmbeddingTestScreen from './src/screens/EmbeddingTestScreen';
import AttendanceCameraScreen from './src/screens/AttendanceCameraScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import RegistrationCameraScreen from './src/screens/RegistrationCameraScreen';
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  useEffect(() => {
    initDatabase();
  }, []);
  useEffect(() => {
    const initializeModel = async () => {
      try {
        console.log('LOADING MODEL...');
        await loadEmbeddingModel();
        console.log('MODEL LOADED');
      } catch (error) {
        console.log('MODEL LOAD ERROR:', error);
      }
    };
    initializeModel();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />

        <Stack.Screen
          name="AttendanceCamera"
          component={AttendanceCameraScreen}
        />
        <Stack.Screen name="EmbeddingTest" component={EmbeddingTestScreen} />
        <Stack.Screen
          name="RegistrationCamera"
          component={RegistrationCameraScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
