import { StyleSheet, View, Dimensions, Platform } from "react-native";
import React, { useState } from "react";
import { horizontalScale, verticalScale } from "../../../utils/matrcis";
import { Button, Text } from "react-native-paper";
import { useInternet } from "../../../store/context/Internet";
import ImgGridPreview from "./ImgGridPreview";
import customTheme from "../../../common/colors/theme";
import { colors } from "../../../common/colors";
// import { storage } from "../../../store/MMKVStore";
import { GetAttachment } from "../../../services/GetRequestService/GetAttachments";
import DeleteAttachment from "../../../services/DeleteReqService/DeleteDocument";
import getRandomNumber from "../../../utils/GetRandomNumber";
import PDPdfViewer from "./PDPreview";
const {  height } = Dimensions.get("screen");

const SlideScreen = ({
  quesResp,
  sectionLabel,
  name,
  onChangeValue,
  setLocalResData,
  AllowDelete,
  setDocDetails,
  fileExtention,
  pdfData,
}) => {
  const isOnline = useInternet();
  // const [coordinates, setCoordinates] = useState({});
  // const [isCaptureDisabled, setIsCaptureDisabled] = useState(false);
  //   --------------Need to remove--------
  //   const [imgData, setImgData] = React.useState(quesResp ? quesResp : []);
  // -----------------------------------------Comented after queresp Changes----------
  React.useEffect(() => {
    const binaryData = quesResp?.map(async (doc) => {
      let fileData =
        doc?.res && doc?.res?.id && (await GetAttachment(doc?.res?.id));
      // if (!storage.contains(doc.fileName)) {
      //   storage.set(doc.fileName, fileData?.encodedBody);
      // }
    });
    Promise.all(binaryData);
  }, [quesResp]);
  // --------------------------------------------------
  // const fileConfiguration = JSON.parse(fileConfig || "{}");
  // const { AllowDelete, AllowUpload, AllowMultipleFile, FileExtention } =
  //   fileConfiguration || {};
  // -------------------Camera Handler-------------------------------

  // const onOpenCamera = async () => {
  //   try {

  //     if (AllowUpload && !AllowMultipleFile && quesResp.length >= 1) {
  //       setIsCaptureDisabled(true);
  //       return;
  //     }

  //     let position;
  //     if (Platform.OS === "android") {
  //       let isLocation = await LocationProvider();
  //       // console.log('Location', isLocation);
  //       if (isLocation) {
  //         position = await GetGeoLocation();
  //         setCoordinates(position.coords);
  //       } else {
  //         Toast.show({
  //           text1: "Please Enable Location",
  //           type: "error",
  //         });
  //       }
  //       // console.log('Position', position);
  //     } else {
  //       Geolocation.requestAuthorization("whenInUse");
  //       position = await GetGeoLocation();
  //       setCoordinates(position.coords);
  //     }
  //     const res = await CameraScanner({AllowMultipleFile});
  //     let newArray = [...quesResp, ...res];
  //     let updatedRes = newArray.map((image) => {
  //       if (image.isBase64) {
  //         image.fileUri = "";
  //       }
  //       return image;
  //     });
  //     setLocalResData(updatedRes);
  //     onChangeValue(updatedRes);
  //     if (res?.length > 0) {
  //       console.log("Entered in res.length");
  //       let longitudeFieldIndex = fields.findIndex(
  //         (ques) => ques.quesTitle === "Distance from Fedfina Branch Longitude"
  //       );
  //       longitudeFieldIndex &&
  //         setValue(
  //           `PD.${nestedIndexPD}.questions.${longitudeFieldIndex}.quesResp`,
  //           position?.coords?.longitude
  //         );
  //       let latitudeFieldIndex = fields.findIndex(
  //         (ques) => ques.quesTitle === "Distance from Fedfina Branch Latitude"
  //       );

  //       latitudeFieldIndex &&
  //         setValue(
  //           `PD.${nestedIndexPD}.questions.${latitudeFieldIndex}.quesResp`,
  //           position?.coords?.latitude
  //         );

  //       let dateFieldIndex = fields.findIndex(
  //         (ques) => ques.quesTitle === "Date and time of Visit"
  //       );
  //       let dateString = new Date();
  //       const istDateTime = getISTDateTime();

  //       const formattedDate = dateString.toLocaleDateString('en-US');
  //       console.log(formattedDate);
  //       console.log("IST Date and Time:" , istDateTime);
  //       dateFieldIndex &&
  //         setValue(
  //           `PD.${nestedIndexPD}.questions.${dateFieldIndex}.quesResp`,
  //          ` ${formattedDate} ${istDateTime}`
  //         );
  //       console.log(
  //         "value of Date and visit",
  //         `PD.${nestedIndexPD}.questions.${dateFieldIndex}.quesResp`
  //       );
  //     }
  //   } catch (error) {
  //     console.log("Error onOpenCamera", error);
  //   }
  // };
  // ---------------Delete Fxn---------------------------------
  const onDeleteImage = async (deletedImage) => {
    try {
      if (deletedImage?.res && deletedImage?.res?.id && isOnline) {
        const res = await DeleteAttachment(
          getRandomNumber(1, 1000),
          deletedImage?.res?.id
        );
        if (res.graphs[0].isSuccessful) {
          // storage.delete(deletedImage?.fileName);
          let updatedImageData = quesResp.filter(
            (image) => image.fileName !== deletedImage.fileName
          );
          setLocalResData(updatedImageData);
          onChangeValue(updatedImageData);
        }
      } else {
        // storage.delete(deletedImage?.fileName);
        let updatedImageData = quesResp.filter(
          (image) => image.fileName !== deletedImage.fileName
        );
        setLocalResData(updatedImageData);
        onChangeValue(updatedImageData);
      }
    } catch (error) {
      console.log("Error PD onDeleteImage ", error);
    }
  };
  //   --------------------------------------------------
  return (
    <View style={styles.container}>
      <Text
        variant="titleSmall"
        style={{
          textAlign: "center",
          marginHorizontal: horizontalScale(10),
          color: colors.gray700,
        }}
      >
        {sectionLabel}
      </Text>
      <View style={styles.images}>
        {fileExtention === "pdf" ? (
          <PDPdfViewer doc={pdfData} setDocDetails={setDocDetails} />
        ) : (
          <ImgGridPreview
            imgData={quesResp}
            removeImage={onDeleteImage}
            isAllowDelete={AllowDelete}
          />
        )}
      </View>
      {/* <View style={styles.btnContainer}>
        <Button
          icon="camera"
          mode="contained"
          onPress={onOpenCamera}
          //disabled={isCaptureDisabled}
          style={styles.button}
        >
          Capture
        </Button>
      </View> */}
    </View>
  );
};

export default React.memo(SlideScreen);

const styles = StyleSheet.create({
  container: {
    // width,
    height,
    marginVertical: verticalScale(15),
  },
  images: {
    flex: 0.7,
    marginHorizontal: horizontalScale(5),
  },
  btnContainer: {
    alignItems: "center",
    flex: 0.3,
  },
  button: {
    borderRadius: customTheme.shape.roundness,
  },
});
