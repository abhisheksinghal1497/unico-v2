import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import BottomPopover from "../../../common/components/BottomPopover/BottomPopover";
import { IconButton, Text } from "react-native-paper";
import { Controller } from "react-hook-form";
import { verticalScale } from "../../../utils/matrcis";
import CustomCard from "../../../common/components/CustomCard/CustomCard";
import { useInternet } from "../../../store/context/Internet";
import {
  processImageDataWithFlags,
} from "../Handlers/FetchDocuments";
import { colors } from "../../../common/colors";
import VideoCapture from "../../../common/components/CameraComponent";
import customTheme from "../../../common/colors/theme";

const UploadVideo = ({
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
  watch,
  ...rest
}) => {
  // --------------Filter only File respType questions-------------------

  // ------------------------------
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [recordedVideoPath, setRecordedVideoPath] = useState(null);
  const [doneIsVisible, setDoneIsVisible] = useState(true);
  const [localResData, setLocalResData] = useState([]);
  const isOnline = useInternet();
  const getDocuments = async () => {
    try {
      if (isOnline) {
        // const docDetails = await FetchPDPDFDocuments(
        //   field?.docDetailId,
        //   isOnline
        // );
        const docDetails = await processImageDataWithFlags(value, isOnline);
        setLocalResData([...localResData, ...docDetails]);
        // setValue(name, [...localResData, ...docDetails]);
      }
    } catch (error) {
      console.log("Error in PD Fetching Documents", error);
    }
  };
  //console.log("localResData--------------->", localResData);
  useEffect(() => {
    getDocuments();
  }, []);
  //console.log("fieldconfigh", field?.fileConfig);
  //   --------------------------------
  const toggleUploadModalVisibility = () => {
    setUploadModalVisible(!isUploadModalVisible);
  };

  const fileConfiguration = JSON.parse(field?.fileConfig || "{}");
  const { AllowDelete, AllowUpload, AllowMultipleFile, FileExtention } =
    fileConfiguration || {};

  const handleRecordingComplete = () => {
    setRecordedVideoPath(videoPath);
    setUploadModalVisible(false);
  };

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
              <BottomPopover
                visible={isUploadModalVisible}
                onDismiss={setUploadModalVisible}
                doneIsVisible={doneIsVisible}
              >
                {/* {localResData.length != 0 ? (
                <VideoWebView doc={localResData[0].fileUri} />
              ) : ( */}
                <VideoCapture
                  onClose={toggleUploadModalVisibility}
                  onRecordingComplete={handleRecordingComplete}
                  quesResp={localResData}
                  sectionLabel={label}
                  name={name}
                  setLocalResData={setLocalResData}
                  onChangeValue={(data) => onChange(data)}
                  fileConfig={field?.fileConfig}
                  setValue={setValue}
                  nestedIndexPD={nestedIndexPD}
                  setDoneIsVisible={setDoneIsVisible}
                  AllowDelete={AllowDelete}
                  doneIsVisible={doneIsVisible}
                  index={index}
                  fields={fields}
                  {...rest}
                />
                {/* )} */}
              </BottomPopover>
              <View style={styles.container}>
                <CustomCard>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {required && <Text style={styles.asterisk}>* </Text>}
                    <Text
                      style={{ flex: 0.9, marginRight: 16 }}
                      variant="bodySmall"
                    >
                      {label}
                    </Text>
                    <View>
                      <IconButton
                        icon={
                          value.length !== 0 &&
                          (AllowUpload || AllowMultipleFile)
                            ? "eye"
                            : "camera"
                        }
                        size={15}
                        mode="contained"
                        iconColor={customTheme.colors.onPrimary}
                        containerColor={customTheme.colors.primary}
                        style={{ color: "red" }}
                        onPress={toggleUploadModalVisibility}
                      />
                    </View>
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

export default React.memo(UploadVideo);

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
