import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Button, Text } from "react-native-paper";
import { GetAttachment } from "../../../services/GetRequestService/GetAttachments";
import WebView from "react-native-webview";
import RNFS from "react-native-fs";
import { moderateScale, verticalScale } from "../../../utils/matrcis";
import customTheme from "../../../common/colors/theme";
import Video from "react-native-video";
import IconAlert from "../../../common/components/BottomPopover/IconAlert";
// -----Image Size for Grid Image-----
const VideoWebView = ({ doc, setLocalResData, removeVideo, AllowDelete }) => {
  const [videoUri, setVideoUri] = useState("");
  const [deleteAlert, setDeleteAlert] = useState(false);

  //   ----------------------------------
  const toggleDeleteAlert = () => {
    setDeleteAlert(!deleteAlert);
  };
  // -----------------------------------
  const onClickYesDeleteAlert = async () => {
    removeVideo(doc);
    setDeleteAlert(!deleteAlert);
    // setLocalResData([]);
  };
  // ---------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (doc?.fileUri === "" && doc?.res) {
          // const promises = imgData?.map(async (doc) => {
          try {
            if (doc?.fileUri === "" && doc?.res) {
              let fileData =
                doc?.res && doc?.res?.id && (await GetAttachment(doc?.res?.id));
              downloadToFile(fileData?.encodedBody, doc?.res?.id);
            }
          } catch (error) {
            console.error("Error processing document:", error);
          }
        } else {
          setVideoUri(doc?.fileUri);
        }
      } catch (error) {
        console.error("Error in processing documents:", error);
      }
    };

    fetchData();
  }, []);

  const downloadToFile = (base64Content, contentId) => {
    const path = `file://${RNFS.DocumentDirectoryPath}/${contentId}.${doc?.fileExtension}`;
    RNFS.writeFile(path, base64Content, "base64")
      .then((success) => {
        setVideoUri(path);
      })
      .catch((err) => {
        console.log("File Write Error: ", err?.message);
      });
  };


  return (
    <View style={styles.container}>
      {doc ? (
        <>
          <View style={styles.mobileContainer}>
            <Text style={styles.FilePreviewContainer}>File Preview</Text>
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.video}>
              {Platform.OS === "android" ? (
                <WebView
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowFileAccess={true}
                  allowFileAccessFromFileURLs={true}
                  originWhitelist={["*"]}
                  allowsFullscreenVideo={true}
                  scalesPageToFit={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  allowUniversalAccessFromFileURLs={true}
                  //allowsInlineMediaPlayback={true}
                  source={{
                    html: `<html>
<body>
<video preload="metadata" width="100%" height="90%" controls>
   <source src="${videoUri}#t=0.1" type="video/mp4">
    Your browser does not support the video
</video>
</body>
</html>`,
                  }}
                />
              ) : (
                <Video
                  source={{ uri: videoUri }}
                  style={styles.video}
                  resizeMode="contain"
                  muted={true}
                  paused={true}
                  controls={true}
                />
              )}
              {AllowDelete && (
                <Button
                  icon="trash-can"
                  mode="contained"
                  onPress={toggleDeleteAlert}
                  style={styles.button}
                >
                  Delete
                </Button>
              )}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.noVideoContainer}>
          <Text>No video available</Text>
        </View>
      )}

      <IconAlert
        visible={deleteAlert}
        onClickYes={onClickYesDeleteAlert}
        onDismiss={toggleDeleteAlert}
        message={"Are you sure, You want to delete this  file?"}
        iconName="warning-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    borderRadius: customTheme.shape.roundness,
    alignSelf: "center",
    marginTop: 24,
  },
  video: {
    flex: 0.7,
    // backgroundColor:'red',
    padding: 8,
    //marginTop: 20,
  },
  videoContainer: {
    flex: 0.8,
    justifyContent: "center",
  },
  mobileContainer: {
    marginTop: verticalScale(12),
    backgroundColor: customTheme.colors.surfaceVariant,
    padding: moderateScale(6),
    borderRadius: 10,
    //marginBottom: 10,
  },
  FilePreviewContainer: {
    fontSize: customTheme.fonts.titleMedium.fontSize,
    textAlign: "center",
    fontFamily: customTheme.fonts.titleMedium.fontFamily,
  },
  controls: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VideoWebView;
