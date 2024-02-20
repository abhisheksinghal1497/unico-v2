// import { createContext } from "react";
import { PermissionsAndroid, Platform } from 'react-native';

// export const LocationContext = createContext({ isLocation: false });

export async function LocationProvider() {
  try {
    // const [isLocation, setIsLocation] = useState(false);

    let isLocation = false;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Fedfina Sales Pro',
        message: 'Fedfina Sales Pro want access to your location ',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      isLocation = true;
      //   alert("You can use the location");
    } else {
      isLocation = false;
      console.log('location permission denied');
      //   alert("Location permission denied");
    }
    return isLocation;
  } catch (err) {
    console.warn('Location Error In context', err);
    return err;
  }
}

export async function WritePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You Can access files');
      return true;
    } else {
      console.log('Permission Denied to access files');
      return false;
    }
  } catch (error) {
    return false;
  }
}
export async function CameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You Can access Camera');
      return true;
    } else {
      console.log('Permission Denied to access Camera');
      return false;
    }
  } catch (error) {
    return false;
  }
}
