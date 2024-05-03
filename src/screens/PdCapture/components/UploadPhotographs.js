// require("intl");
import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import BottomPopover from "../../../common/components/BottomPopover/BottomPopover";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
} from "react-native-paper";
import Toast from "react-native-toast-message";

import { PdListStyles } from "../../PD/styles/PdListStyles";
import Carousel from "./Carousel";
import { Controller } from "react-hook-form";
import SlideScreen from "./SlideScreen";
import { verticalScale } from "../../../utils/matrcis";
import CustomCard from "../../../common/components/CustomCard/CustomCard";
import { useInternet } from "../../../store/context/Internet";
import {
  processImageDataWithFlags,
} from "../Handlers/FetchDocuments";
import { colors } from "../../../common/colors";
import CameraScanner from "../../../common/functions/CameraScanner";
import { GetGeoLocation } from "../../../utils/GetGeolocation";

import Geolocation from "react-native-geolocation-service";
import { LocationProvider } from "../../../store/context/AndroidPermissions";
import customTheme from "../../../common/colors/theme";

const UploadPhotographs = ({
  value,
  control,
  validationProps,
  required,
  setValue,
  label,
  defaultValue,
  name,
  field,
  nestedIndexPD,
  index,
  fields,
  ...rest
}) => {
  // --------------Filter only File respType questions-------------------

  // ------------------------------
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [localResData, setLocalResData] = useState([]);
  const [documentDetails, setDocDetails] = useState([]);

  const [isCaptureDisabled, setIsCaptureDisabled] = useState(false);

  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  // const [localResData, setLocalResData] = useState(
  //   defaultValue ? defaultValue : []
  // );
  const isOnline = useInternet();
  const getDocuments = async () => {
    try {
      if (isOnline) {
        const docDetails = await processImageDataWithFlags(value, isOnline);
        // console.log("value--------->", value);
        setLocalResData([...localResData, ...docDetails]);
        setDocDetails((prevDetails) => [...prevDetails, ...docDetails]);
        // setValue(name, [...localResData, ...docDetails]);

      }
    } catch (error) {
      console.log("Error in PD Fetching Documents", error);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  //   --------------------------------
  const toggleUploadModalVisibility = () => {
    setUploadModalVisible(!isUploadModalVisible);
  };
  // ------------------------------------------------
  const fileConfiguration = JSON.parse(field?.fileConfig || "{}");
  const { AllowDelete, AllowUpload, AllowMultipleFile, FileExtention } =
    fileConfiguration || {};
  // ------------------------------------------------

  const getISTDateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12;

    const istDateTime = `${formattedHours}:${minutes} ${ampm}`;

    return istDateTime;
  };

  // -----------------------------------------------------------
  const onOpenCamera = async (onChangeValue) => {
    try {
      setSpinnerLoading(true);
      // if (AllowUpload && !AllowMultipleFile && localResData.length >= 1) {
      //   setIsCaptureDisabled(true);
      //   return;
      // }

      let position;
      if (Platform.OS === "android") {
        let isLocation = await LocationProvider();
        // console.log('Location', isLocation);
        if (isLocation) {
          position = await GetGeoLocation();
          setCoordinates(position.coords);
        } else {
          Toast.show({
            text1: "Please Enable Location",
            type: "error",
          });
        }
        // console.log('Position', position);
      } else {
        Geolocation.requestAuthorization("whenInUse");
        position = await GetGeoLocation();
        setCoordinates(position.coords);
      }
      const res = await CameraScanner();
      setSpinnerLoading(false);
      let newArray = [...localResData, ...res];

      let updatedRes = newArray.map((image) => {
        /* File size check if gallery uplod introduced */
        // if(image && image?.fileSize > 5){

        //   Toast.show({
        //     text1: "File Size should be less then 5 MB",
        //     type: "error",
        //   });

        if (image.isBase64) {
          image.fileUri = "";
        }
        return image;
      });

      setLocalResData(updatedRes);
      onChangeValue(updatedRes);
      if (res?.length > 0) {
        console.log("Entered in res.length");
        let longitudeFieldIndex = fields.findIndex(
          (ques) => ques.quesTitle === "Longitude of Property"
        );
        longitudeFieldIndex &&
          setValue(
            `PD.${nestedIndexPD}.questions.${longitudeFieldIndex}.quesResp`,
            position?.coords?.longitude
          );
        let latitudeFieldIndex = fields.findIndex(
          (ques) => ques.quesTitle === "Latitude of Property"
        );

        latitudeFieldIndex &&
          setValue(
            `PD.${nestedIndexPD}.questions.${latitudeFieldIndex}.quesResp`,
            position?.coords?.latitude
          );

        let dateFieldIndex = fields.findIndex(
          (ques) => ques.quesTitle === "Date and time of Visit"
        );
        let dateString = new Date();
        const istDateTime = getISTDateTime();
        // ---------------------------
        const day = dateString.getDate();
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const monthIndex = dateString.getMonth();
        const month = monthNames[monthIndex];
        const year = dateString.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        // -----------------------
        // const formattedDate = dateString.toLocaleDateString("en-US");
        dateFieldIndex &&
          setValue(
            `PD.${nestedIndexPD}.questions.${dateFieldIndex}.quesResp`,
            ` ${formattedDate} ${istDateTime}`
          );
        // console.log(
        //   "value of Date and visit",
        //   `PD.${nestedIndexPD}.questions.${dateFieldIndex}.quesResp`
        // );
      }
    } catch (error) {
      console.log("Error onOpenCamera", error);
    }
  };
  // ---------------------------------------------
  return (
    <>
      <Controller
        control={control}
        rules={validationProps}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error, invalid },
        }) => {
          return (
            <>
              {spinnerLoading && (
                <View style={PdListStyles.loaderView}>
                  <ActivityIndicator
                    size="large"
                    color={customTheme.colors.primary}
                  />
                </View>
              )}
              <BottomPopover
                visible={isUploadModalVisible}
                onDismiss={setUploadModalVisible}
              >
                {/* <Carousel pdImageMetaData={questions} />
                 */}
                {/* {field.quesTitle === "Bureau report" ? (
                <PDPdfViewer
                  doc={documentDetails[0]}
                  sectionLabel={label}
                  setDocDetails={setDocDetails}
                  name={name}
                  setLocalResData={setLocalResData}
                 // onChangeValue={(data) => onChange(data)}
                  setValue={setValue}
                  nestedIndexPD={nestedIndexPD}
                  index={index}
                  fileConfig={field?.fileConfig}
                  fields={fields}
                  {...rest}
                />
              )
: */}
                <SlideScreen
                  quesResp={localResData}
                  pdfData={documentDetails[0]}
                  sectionLabel={label}
                  name={name}
                  setLocalResData={setLocalResData}
                  setDocDetails={setDocDetails}
                  fileExtention={FileExtention}
                  onChangeValue={(data) => onChange(data)}
                  setValue={setValue}
                  AllowDelete={AllowDelete}
                  nestedIndexPD={nestedIndexPD}
                  index={index}
                  fileConfig={field?.fileConfig}
                  fields={fields}
                  {...rest}
                />
              </BottomPopover>
              <View style={styles.container}>
                <CustomCard>
                  <View style={{ flexDirection: "row" }}>
                    {required && <Text style={styles.asterisk}>* </Text>}
                    <Text
                      style={{ flex: 0.9, marginRight: 16 }}
                      variant="bodySmall"
                    >
                      {label}
                    </Text>
                  </View>
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    {(value.length !== 0 || FileExtention === "pdf") && (
                      <IconButton
                        icon="eye"
                        size={15}
                        mode="contained"
                        disabled={spinnerLoading}
                        iconColor={customTheme.colors.onPrimary}
                        containerColor={customTheme.colors.primary}
                        style={{ color: "red" }}
                        onPress={toggleUploadModalVisibility}
                      />
                    )}
                    {(AllowUpload || AllowMultipleFile) && (
                      <IconButton
                        icon="camera"
                        size={15}
                        mode="contained"
                        disabled={spinnerLoading}
                        iconColor={customTheme.colors.onPrimary}
                        containerColor={customTheme.colors.primary}
                        style={{ color: "red" }}
                        onPress={() => {
                          onOpenCamera(onChange);
                        }}
                      />
                    )}
                    {/* <Button
              style={{ ...PdListStyles.button, marginLeft: 4 }}
              mode="contained"
              compact={true}
              disabled={isCaptureDisabled}
              onPress={onOpenCamera}
            >
              Capture
            </Button> */}
                  </View>
                </CustomCard>
                {error?.message && (
                  <Text style={styles.errorMessage}>{error?.message}</Text>
                )}
              </View>
            </>
          );
        }}
        name={name}
      />
    </>
  );
};

export default React.memo(UploadPhotographs);

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(2),
  },
  asterisk: {
    color: colors.asteriskRequired,
  },
  errorMessage: {
    color: customTheme.colors.error,
    marginTop: verticalScale(2),
  },
});
