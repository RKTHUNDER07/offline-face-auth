import React, {useEffect} from 'react';

import {loadEmbeddingModel} from './src/core/embeddings/loadModel';
import {initDatabase} from './src/core/storage/initDatabase';
import {NavigationContainer} from '@react-navigation/native';
import {syncAttendance} from './src/core/storage/syncAttendance';
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
    const initializeApp = async () => {
      try {
        console.log(
          '---------------------------------------------------------------------------------------------------',
        );
        /*
        INIT DATABASE
      */

        await initDatabase();

        /*
        LOAD MODEL
      */

        console.log('LOADING MODEL...');

        await loadEmbeddingModel();

        console.log('MODEL LOADED');

        /*
        SYNC ATTENDANCE
      */

        await syncAttendance();

        console.log('ATTENDANCE SYNC COMPLETE');
      } catch (error) {
        console.log('APP INIT ERROR::', error);
      }
    };

    initializeApp();
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
