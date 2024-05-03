import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import Pdf from "react-native-pdf";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import RNFS from "react-native-fs";

import { useInternet } from "../../../store/context/Internet";
// import { storage } from "../../../store/MMKVStore";
import Touchable from "../../../common/components/TouchableComponent/Touchable";
import { GetAttachment } from "../../../services/GetRequestService/GetAttachments";
import { Button, Snackbar } from "react-native-paper";

import Ionicons from "react-native-vector-icons/Ionicons";
import customTheme from "../../../common/colors/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../utils/matrcis";
import { colors } from "../../../common/colors";
const width = Dimensions.get("screen").width;
const imageWidth = width / 2 - moderateScale(25);

const PDPdfViewer = ({ doc, setDocDetails }) => {
  const isOnline = useInternet();
  const [base64Data, setBase64Data] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const getDocumentData = async () => {
    try {
      if (doc.fileUri === "") {
        if (isOnline) {
          const getDocument = await GetAttachment(doc?.res?.id);
          setDocDetails((prevState) => {
            let newState = prevState.map((state) => {
              if (state?.res?.id === doc?.res?.id) {
                state.fileUri = getDocument.encodedBody;
              }
              return state;
            });

            return newState;
          });
          setBase64Data(getDocument.encodedBody);
        } else {
          setDocDetails((prevState) => {
            let newState = prevState.map((state) => {
              if (state.fileName === doc.fileName) {
                // state.fileUri = storage.getString(state.fileName);
              }
              return state;
            });
            return newState;
          });
        }
      }
    } catch (error) {
      console.log("Error", getDocumentData);
    }
  };
  // const requestExternalStoragePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: "Storage Permission",
  //         message: "App needs access to your storage to save files.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK",
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("External storage permission granted");
  //       return true;
  //     } else {
  //       console.log("External storage permission denied");
  //       return false;
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // };
  // ----------------------------------------------------
  const handleDownload = async () => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/Bureau Report.pdf`;
      const targetPath = `${RNFS.DownloadDirectoryPath}/Bureau Report.pdf`;

      await RNFS.writeFile(path, base64Data, "base64");

      if (Platform.OS === "android") {
        await RNFS.copyFile(path, targetPath);
        await RNFS.unlink(path);
      }
      setSnackbarVisible(true);
      setSnackbarMessage("PDF downloaded successfully!");
      console.log("Downloaded file path:", targetPath);
    } catch (error) {
      console.error("Error handling PDF:", error);
    }
  };
  // --------------------------------------------------------------------------
  // const handleDownload = async () => {
  //   try {
  //     const path = `${RNFS.DocumentDirectoryPath}/${
  //       doc?.res?.id
  //     }/${"Bureay Report.pdf"}`;
  //     const targetPath = `${RNFS.DownloadDirectoryPath}/Bureau Report.pdf`;

  //     // Check if external storage permission is granted
  //     // const isPermissionGranted = await requestExternalStoragePermission();
  //     // if (!isPermissionGranted) {
  //     //   console.error('Download failed: Storage permission denied');
  //     //   return;
  //     // }

  //     // Write base64 content to the file
  //     await RNFS.writeFile(path, base64Data, "base64");

  //     // Copy the file to the download directory
  //     await RNFS.copyFile(path, targetPath);
  //     await RNFS.unlink(path);
  //     // Show a success message
  //     //ToastAndroid.show('PDF downloaded successfully!', ToastAndroid.SHORT);
  //     setSnackbarVisible(true);
  //     setSnackbarMessage("PDF downloaded successfully!");
  //     // Log the target path
  //     console.log("Downloaded file path:", targetPath);
  //   } catch (error) {
  //     console.error("Error handling PDF:", error);
  //   }
  // };

  React.useEffect(() => {
    getDocumentData();
  }, [doc]);
  return (
    <View style={styles.container}>
      {!doc ? (
        <View style={styles.waterMarkContainer}>
          <Ionicons
            name="images-outline"
            size={imageWidth}
            color={colors.secondaryText}
          />
          <Text
            variant="labelSmall"
            style={{
              marginHorizontal: horizontalScale(10),
              color: colors.secondaryText,
            }}
          >
            No files are available to preview.
          </Text>
        </View>
      ) : (
        <View>
          <Pdf
            source={
              doc.isBase64
                ? { uri: `data:application/pdf;base64,${doc.fileUri}` }
                : {
                    uri: doc.fileUri,
                  }
            }
            onError={(error) => {
              console.log(error);
            }}
            style={styles.pdf}
          />

          <View style={styles.downloadButton}>
            <Button
              mode="contained"
              icon="file-download"
              onPress={handleDownload}
            >
              Download
            </Button>
          </View>
        </View>
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={500}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default PDPdfViewer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: verticalScale(25),
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  waterMarkContainer: {
    flex: 1,

    padding: moderateScale(8),
    marginVertical: verticalScale(12),
    alignItems: "center",
    justifyContent: "center",
    // width: "95%",
  },
  downloadButton: {
    // position: "absolute",
    alignSelf: "center",
    marginBottom: verticalScale(-70),
    bottom: verticalScale(20),
  },
});
