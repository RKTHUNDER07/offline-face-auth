import Geolocation from 'react-native-geolocation-service';

import {PermissionsAndroid, Platform} from 'react-native';

export interface DeviceLocation {
  latitude: number;

  longitude: number;
}

async function requestLocationPermission() {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function getCurrentLocation(): Promise<DeviceLocation> {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    throw new Error('Location permission denied');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,
        });
      },

      error => {
        console.log('LOCATION ERROR:', error);

        reject(error);
      },

      {
        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 10000,

        forceRequestLocation: true,

        showLocationDialog: true,
      },
    );
  });
}
