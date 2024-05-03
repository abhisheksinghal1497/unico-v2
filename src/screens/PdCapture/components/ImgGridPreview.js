import { StyleSheet, View, Dimensions, Image } from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../utils/matrcis";
import { IconButton, Text } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import customTheme from "../../../common/colors/theme";
import ViewImage from "./ViewImage";
import { colors } from "../../../common/colors";
// import { storage } from "../../../store/MMKVStore";
import IconAlert from "../../../common/components/BottomPopover/IconAlert";
// -----Image size for Image View Mode-----
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
// -----Image Size for Grid Image-----
const imageWidth = width / 2 - moderateScale(25);
const imageHeight = imageWidth;

const ImgGridPreview = ({ imgData, removeImage,isAllowDelete }) => {
  const [isFileVisible, setFileVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});
  const [deleteAlert, setDeleteAlert] = useState(false);

  // -----------------------------------------------
  const toggleFileVisibility = (item) => {
    setSelectedFile(item);
    setFileVisible(!isFileVisible);
  };
  //   ----------------------------------
  const toggleDeleteAlert = (item) => {
    setSelectedFile(item);
    setDeleteAlert(!deleteAlert);
  };
  // -----------------------------------
  const onClickYesDeleteAlert = () => {
    removeImage(selectedFile);
    setDeleteAlert(!deleteAlert);
  };
  // ------------------------------------
  return (
    <View style={styles.container}>
      {imgData.length === 0 && (
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
            Press Capture to Add Photos
          </Text>
        </View>
      )}
      <FlatList
        data={imgData}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            {/* <Image
              source={
                item.isBase64
                  ? {
                      uri: `data:${
                        item.fileExtension
                      };base64,${storage.getString(item.fileName)}`,
                    }
                  : { uri: item.fileUri }
                // { uri: `data:image/jpeg;base64,${storage.getString('Image')}` }
              }
              style={styles.image}
              // resizeMode="contain"
            /> */}
            <View style={styles.imgActionBtn}>
              <IconButton
                icon="eye"
                size={15}
                mode="contained-tonal"
                iconColor={customTheme.colors.primary}
                style={{ color: "red" }}
                onPress={() => toggleFileVisibility(item)}
              />

            {isAllowDelete && <IconButton
                icon="trash-can"
                size={15}
                mode="contained-tonal"
                iconColor={customTheme.colors.error}
                style={{ color: "red" }}
                onPress={() => toggleDeleteAlert(item)}
              />}
            </View>
          </View>
        )}
      />
      <ViewImage
        selectedFile={selectedFile}
        isFileVisible={isFileVisible}
        toggleFileVisibility={toggleFileVisibility}
      />
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

export default ImgGridPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginVertical: verticalScale(10),
    // paddingHorizontal: 10,
    zIndex: 1,
  },
  image: {
    margin: moderateScale(4),
    width: imageWidth,
    height: imageHeight,
  },
  imageContainer: {
    position: "relative",
  },
  waterMarkContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.secondaryText,
    borderStyle: "dashed",
    padding: moderateScale(8),
    marginVertical: verticalScale(12),
    alignItems: "center",
    justifyContent: "center",
    // width: "95%",
  },
  imgActionBtn: {
    position: "absolute",
    top: verticalScale(10),
    right: horizontalScale(10),
    zIndex: 1,
    flexDirection: "row",
  },
});
