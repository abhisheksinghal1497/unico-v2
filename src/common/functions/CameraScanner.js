import { Platform } from "react-native";
import Toast from "react-native-toast-message";

import DocumentScanner from "react-native-document-scanner-plugin";
import { moveImageToPrivateDirectory } from "../../utils/moveImageToCache";
import {
  CameraPermission,
  WritePermission,
} from "../../store/context/AndroidPermissions";
const CameraScanner = async () => {
  try {
    let permission = false;
    if (Platform.OS === "android") {
      permission = await CameraPermission();
    } else {
      // write permission for IOS
      permission = true;
    }
    if (!permission) {
      Toast.show({
        type: "info",
        text1: "Allow Camera Access",
      });
      return [];
    }
    // const { scannedImages, status } = !AllowMultipleFile
    //   ? await DocumentScanner.scanDocument({ maxNumDocuments: 1 })
    //   : await DocumentScanner.scanDocument();
    const { scannedImages, status } = await DocumentScanner.scanDocument();
    // console.log('Result ', result);

    if (status !== "success") {
      return [];
    }

    let securedImages = moveImageToPrivateDirectory(scannedImages, true);

    return securedImages;
  } catch (error) {
    console.log("Error at Camera scanner ", error);
    return error;
  }
};

export default CameraScanner;
