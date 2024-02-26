import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useState } from "react";
import { useInternet } from "../../store/context/Internet";
import { BottomTabContext } from "../../navigation/mainNavigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getBankBranchMaster,
  getCustomerMaster,
  getDsaBrJn,
  getLocationBrJnMaster,
  getPincodeMaster,
  getProductMapping,
} from "../../store/redux/actions/masterData";
import { getLeadMetadata } from "../../store/redux/actions/leadMetadata";
import { useForm } from "react-hook-form";
import customTheme from "../../common/colors/theme";
import { addLeadStyle } from "./styles/AddLeadStyle";
import Stepper from "../../common/components/StepperComponent/Stepper";
import LeadActivities from "../../common/components/MandatoyToggle";
import LeadSourceDetails from "./components/SourceDetails";
import LeadPersonalDetails from "./components/PersonalDetails";
import { ScrollView } from "react-native-gesture-handler";
import LeadAdditionalDetails from "./components/AdditionalDetails";
import { Button } from "react-native-paper";
import { getThMaster } from "../../store/redux/actions/teamHeirarchy";
import { OnSubmitLead } from "./components/Handlers/onSubmit";
import { useRole } from "../../store/context/RoleProvider";
import { globalConstants } from "../../common/constants/globalConstants";
import { createValidationSchema } from "./components/Handlers/validationSchema";
import { validatePincode } from "./components/Handlers/validatePincode";
import Toast from "react-native-toast-message";
import CustomAlert from "../../common/components/BottomPopover/CustomAlert";
import { GetDefaultValues } from "./components/Handlers/GetDefaultValues";
import MobileOtpConsent from "./components/OtpVerification/components/MobileOtpConsent";
import LeadConverted from "./components/LeadConverted/LeadConverted";
const AddLead = () => {
  // --------Define Variables Here----------//

  const isOnline = useInternet();
  const empRole = useRole();
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [postData, setPostData] = useState({});
  const [id, setId] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isFormEditable, setFormEditable] = useState(true);
  const [conversionResponse, setConversionResponse] = useState({});
  const [addLoading, setAddLoading] = useState(false);
  const [retryCounts, setRetryCounts] = useState([]);
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(globalConstants.otpTimer);
  const maxRetries = globalConstants.otpRetries;
  const steps = ["Basic details", "OTP Verification", "Lead Converted"];
  const dispatch = useDispatch();
  //Fetch Data from store//
  const { leadMetadata } = useSelector((state) => state.leadMetadata);
  const { teamHeirarchyByUserId } = useSelector(
    (state) => state.teamHeirarchy.teamHeirarchyById
  );
  const { teamHeirarchyMasterData } = useSelector(
    (state) => state.teamHeirarchy.teamHeirarchyMaster
  );
  const { productMappingData } = useSelector(
    (state) => state.masterData.productMapping
  );
  const { dsaBrJnData } = useSelector((state) => state.masterData.dsaBrJn);
  const { customerMasterData } = useSelector(
    (state) => state.masterData.customerMaster
  );

  const { pincodeMasterData } = useSelector(
    (state) => state.masterData.pincodeMaster
  );

  // console.log('Lead Meta Data', productMappingData);
  // const productTypes = [
  //   ...new Set(productMappingData.map((product) => product.Family)),
  // ];
  // console.log('Product Type', productTypes);
  useEffect(() => {
    dispatch(getProductMapping());
    dispatch(getLeadMetadata());
    dispatch(getDsaBrJn());
    dispatch(getCustomerMaster());
    dispatch(getThMaster());
    dispatch(getPincodeMaster());
    setHideBottomTab(true);
  }, []);

  //------------Default Values ---------------
  const defaultValues = GetDefaultValues(
    teamHeirarchyByUserId,
    dsaBrJnData,
    empRole
  );
  const validationSchema = createValidationSchema(empRole);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    //resolver: yupResolver(validationSchema),
    mode: "all",
  });

  useEffect(() => {
    reset(initialLeadData);
  }, [postData]);
  // ---------------------------------------------
  const initialLeadData =
    Object.keys(postData).length > 0 ? postData : defaultValues;

  useEffect(() => {
    setHasErrors(Object.keys(errors).length > 0);
  }, [errors]);

  // --------------Handlers-------------//

  //------ Submit Handler ------//
  const onSubmit = async (data) => {
    try {
      setAddLoading(true);
      // Toast.show({
      //   type: 'success',
      //   text1: 'Lead created successfully',
      //   position: 'top',
      // });

      // await OnSubmitLead(
      //   data,
      //   setId,
      //   id,
      //   teamHeirarchyByUserId,
      //   dsaBrJnData,
      //   empRole,
      //   isOnline,
      //   setPostData,
      //   setCurrentPosition,
      //   currentPosition,
      //   teamHeirarchyMasterData,
      //   productMappingData
      // );
      setCurrentPosition((prev) => prev + 1);
      setAddLoading(false);
      // setIsPincodeConfirmed(false);
    } catch (error) {
      setAddLoading(false);

      Toast.show({
        type: "error",
        text1: "Failed to create lead",
        position: "top",
      });
      console.log("Error in handleSubmit: ", error);
    }
  };
  const handleConvertButton = () => {
    navigation.navigate(screens.leadList);
  };

  

  //------Step Handlers------//
  const handlePrevSubmit = () => {
    setCurrentPosition((prev) => prev - 1);
  };

  // console.log('Lead MetaData', leadMetadata);

  return (
    <View style={addLeadStyle.container}>
      {addLoading && (
        <View style={addLeadStyle.loaderView}>
          <ActivityIndicator size="large" color={customTheme.colors.primary} />
        </View>
      )}
      <Stepper steps={steps} totalSteps={3} currentPosition={currentPosition} />

      {currentPosition === 0 && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
          keyboardVerticalOffset={Platform.select({ ios: 125, android: 500 })}
        >
          <LeadActivities />
          <ScrollView>
            {globalConstants.RoleNames.RM === empRole && (
              <LeadSourceDetails
                leadMetadata={leadMetadata}
                dsaBrJn={dsaBrJnData}
                customerMasterData={customerMasterData}
                teamHeirarchyMasterData={teamHeirarchyMasterData}
                control={control}
                setValue={setValue}
                watch={watch}
                collapsedError={hasErrors}
                pincodeMasterData={pincodeMasterData}
              />
            )}
            <LeadPersonalDetails
              leadMetadata={leadMetadata}
              control={control}
              setValue={setValue}
              collapsedError={hasErrors}
              pincodeMasterData={pincodeMasterData}
              teamHeirarchyMasterData={teamHeirarchyMasterData}
              teamHeirarchyByUserId={teamHeirarchyByUserId}
              dsaBrJn={dsaBrJnData}
              watch={watch}
            />
            <LeadAdditionalDetails
              leadMetadata={leadMetadata}
              control={control}
              setValue={setValue}
              teamHeirarchyByUserId={teamHeirarchyByUserId}
              productMapping={productMappingData}
              watch={watch}
              collapsedError={hasErrors}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {currentPosition === 1 && (
        <MobileOtpConsent
          LeadCaptureData={postData}
          LeadId={id}
          leadMetadata={leadMetadata}
          setRetryCounts={setRetryCounts}
          retryCounts={retryCounts}
          maxRetries={maxRetries}
          expectedOtp={expectedOtp}
          setExpectedOtp={setExpectedOtp}
          control={control}
          handleSubmit={handleSubmit}
          watch={watch}
          setValue={setValue}
          otp={otp}
          setOtp={setOtp}
          setAddLoading={setAddLoading}
          timer={timer}
          setTimer={setTimer}
        />
      )}
        {currentPosition === 2 && (
        <LeadConverted
          handleConvertButton={handleConvertButton}
          LeadCaptureData={conversionResponse}
        />
      )}
      <View style={addLeadStyle.buttonContainer}>
        <Button
          mode={!isFormEditable ? "contained" : "outlined"}
          style={addLeadStyle.cancelButton}
          disabled={!isFormEditable}
          onPress={handleSubmit(onSubmit)}
          icon="play"
          contentStyle={{ flexDirection: "row-reverse" }}
        >
          {globalConstants.RoleNames.RM === empRole ? "Next" : "Save"}
        </Button>
        {currentPosition === 1 && (
          <Button
            mode="outlined"
            style={addLeadStyle.cancelButton}
            onPress={handlePrevSubmit}
          >
            Previous
          </Button>
        )}
      </View>
      {/* <Text>AddLead</Text> */}
    </View>
  );
};

export default AddLead;
