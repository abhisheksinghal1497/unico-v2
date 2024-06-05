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
  getDsaBrJnMaster,
  getLocationBrJnMaster,
  getPincodeMaster,
  getProductMapping,
} from "../../store/redux/actions/masterData";
import { getLeadMetadata } from "../../store/redux/actions/leadMetadata";
import { useForm } from "react-hook-form";
import customTheme from "../../common/colors/theme";
import Stepper from "../../common/components/StepperComponent/Stepper";
import LeadActivities from "../../common/components/MandatoyToggle";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { getThMaster } from "../../store/redux/actions/teamHeirarchy";
import { useRole } from "../../store/context/RoleProvider";
import {
  ROLES,
  USERACCESS,
  globalConstants,
} from "../../common/constants/globalConstants";
import Toast from "react-native-toast-message";
import CustomAlert, {
  customAlertDefaultState,
} from "../../common/components/BottomPopover/CustomAlert";
import { createValidationSchema } from "../LeadCapture/components/Handlers/validationSchema";
import { QueryObject } from "../../services/QueryObject";
import { query } from "../../common/constants/Queries";
import { GetBrManagerBrName } from "../LeadCapture/components/Handlers/GetBranchManagerId";
import { GetProductSubTypeName } from "../LeadCapture/components/Handlers/GetProductId";
import LeadSourceDetails from "../LeadCapture/components/SourceDetails";
import LeadPersonalDetails from "../LeadCapture/components/PersonalDetails";
import LeadAdditionalDetails from "../LeadCapture/components/AdditionalDetails";
import { addLeadStyle } from "../LeadCapture/styles/AddLeadStyle";
import { useRoute } from "@react-navigation/native";
import {
  GetBrNameByBrId,
  GetRmSmName,
} from "../LeadCapture/components/Handlers/GetChannelId";
import MobileOtpConsent from "../LeadCapture/components/OtpVerification/components/MobileOtpConsent";
import LeadConverted from "../LeadCapture/components/LeadConverted/LeadConverted";
import { OnSubmitLead } from "../LeadCapture/components/Handlers/onSubmit";
import { screens } from "../../common/constants/screen";
import BackgroundTimer from "react-native-background-timer";
import EMICalculatorComponent from "../../common/components/Modal/EMICalculatorComponent";
import ScheduleMeetComponent from "../../common/components/Modal/ScheduleMeetComponent";
import { oauth } from "react-native-force";
import { ConvertLead } from "../LeadCapture/components/Handlers/ConvertLead";
import StatusCard from "../LeadList/component/statusCard";
import { verticalScale } from "../../utils/matrcis";
export default function EditLeadScreen({ navigation }) {
  const route = useRoute();
  let leadId = route.params.Id;
  let leadStatus = route.params.statusName;
  const isOnline = useInternet();
  const empRole = useRole();
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [alert, setAlert] = useState(customAlertDefaultState);
  const [conversionResponse, setConversionResponse] = useState({});
  const [hasErrors, setHasErrors] = React.useState(false);
  const [postData, setPostData] = useState({});
  const [id, setId] = useState(leadId);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isFormEditable, setFormEditable] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [isMobileNumberChanged, setIsMobileNumberChanged] = useState(false);
  const [retryCounts, setRetryCounts] = useState(0);
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(globalConstants.otpTimer);
  const [coolingPeriodTimer, setCoolingPeriodTimer] = useState(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [emiModalVisible, setEmiModalVisible] = useState(false);
  const maxRetries = globalConstants.otpRetries;
  const steps = ["Basic details", "OTP Verification"];
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
  const { dsaBrJnMasterData } = useSelector(
    (state) => state.masterData.dsaBrJnMaster
  );
  const { customerMasterData } = useSelector(
    (state) => state.masterData.customerMaster
  );

  const { pincodeMasterData } = useSelector(
    (state) => state.masterData.pincodeMaster
  );

  const getLeadData = async () => {
    try {
      setAddLoading(true);
      let leadData = {};
      if (isOnline) {
        let leadById = await QueryObject(query.getLeadByIdQuery(id));
        leadData =
          leadById?.records?.length > 0 ? { ...leadById?.records[0] } : {};
        // console.log('isOnline', leadData, id);
      } else {
        let offlineLead = await QuerySoupById(
          soupConfig.lead.soupName,
          soupConfig.lead.queryPath,
          id,
          soupConfig.lead.pageSize
        );
        leadData = offlineLead?.length > 0 ? { ...offlineLead[0] } : {};
      }

      setPostData(leadData);
      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);
      Toast.show({
        type: "error",
        text1: JSON.stringify(error),
        position: "top",
      });
      // navigation.goback();
      console.log("Error getLeadData", error);
    }
  };
  useEffect(() => {
    getLeadData();
  }, [id]);
  //   console.log('Post Data', postData);
  const decrementTimer = () => {
    if (timer > 0) {
      setTimer(timer - 1);
    }
    if (coolingPeriodTimer && coolingPeriodTimer > 0) {
      setCoolingPeriodTimer(coolingPeriodTimer - 1);
    }
  };
  useEffect(() => {
    const interval = BackgroundTimer.setInterval(decrementTimer, 1000);
    return () => BackgroundTimer.clearInterval(interval);
  }, [timer, coolingPeriodTimer]);

  useEffect(() => {
    dispatch(getProductMapping());
    dispatch(getLeadMetadata());
    dispatch(getDsaBrJn());
    dispatch(getDsaBrJnMaster());
    dispatch(getCustomerMaster());
    dispatch(getThMaster());
    dispatch(getPincodeMaster());
    setHideBottomTab(true);
  }, []);

  const defaultValues = {};
  const checkOwner = (postData) => {
    oauth.getAuthCredentials((cred) => {
      if (id && id.length > 0) {
        if (postData?.Status === "Closed Lead") {
          setFormEditable(false);
          return;
        }
        // console.log('Entered', id, postData?.OwnerId, cred?.userId);
        if (USERACCESS.LEAD_CAPTURE.FullAccess.includes(empRole)) {
          if (postData?.OwnerId === cred?.userId) {
            //   console.log('Entered 2 ', cred);
            setFormEditable(true);
          }
          return;
        }

        setFormEditable(false);
        return;
      }
      setFormEditable(false);
      return;
    });
  };

  useEffect(() => {
    checkOwner(postData);
  }, [id, postData, empRole]);

  useEffect(() => {
    if (Object.keys(postData).length > 0) {
      let data = { ...postData };

      let getChannelNameByIdOrName = () => {
        return data?.Channel_Name__c && data?.Channel_Name__c.length > 0
          ? dsaBrJnMasterData?.find(
              (value) =>
                value.Account__r.Name === data.Channel_Name__c ||
                value.Account__c === data.Channel_Name__c
            )?.Account__r.Name
          : "";
      };
      let custIdName = () => {
        return data?.Cust_ID__c && data?.Cust_ID__c?.length > 0
          ? customerMasterData?.find((value) => value?.Id === data?.Cust_ID__c)
              ?.Name
          : "";
      };
      // console.log('');
      data.Cust_ID = custIdName();
      data.Channel_Name = getChannelNameByIdOrName();

      data.MobilePhoneOtp = data.MobilePhone;
      data.RM_SM_Name = GetRmSmName(
        teamHeirarchyMasterData,
        data.RM_SM_Name__c
      );
      if (empRole === globalConstants.RoleNames.UGA) {
        data.RM_Name = GetRmSmName(teamHeirarchyMasterData, data.RM_SM_Name__c);
      }
      data.Br_Manager_Br_Name = GetBrNameByBrId(
        pincodeMasterData,
        data.Bank_Branch__c
      );
      // console.log('Data Br_Manager_Br_Name', data.Br_Manager_Br_Name);
      data.ProductLookup = GetProductSubTypeName(
        productMappingData,
        data.ProductLookup__c
      );

      reset({ ...data });
    }
  }, [
    postData,
    teamHeirarchyByUserId,
    teamHeirarchyMasterData,
    dsaBrJnMasterData,
    customerMasterData,
  ]);
  const validationSchema = createValidationSchema(empRole, currentPosition);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  useEffect(() => {
    setHasErrors(Object.keys(errors).length > 0);
  }, [errors]);

  const handleConvertButton = () => {
    navigation.navigate(screens.leadList);
  };
  //------ Handlers------//
  const handlePrevSubmit = () => {
    setCurrentPosition((prev) => prev - 1);
  };

  //   console.log('Watch', watch());

  const onSubmit = async (data) => {
    try {
      setAddLoading(true);

      //   console.log('Onsubmit', data);
      await OnSubmitLead(
        data,
        setId,
        id,
        teamHeirarchyByUserId,
        dsaBrJnData,
        empRole,
        isOnline,
        setPostData,
        setCurrentPosition,
        currentPosition,
        teamHeirarchyMasterData,
        productMappingData,
        pincodeMasterData,
        setIsMobileNumberChanged,
        dsaBrJnMasterData,
        customerMasterData
      );
      //   setCurrentPosition((prev) => prev + 1);
      setAddLoading(false);
    } catch (error) {
      //   setAddLoading(false);

      //   Toast.show({
      //     type: 'error',
      //     text1: 'Failed to create lead',
      //     position: 'top',
      //   });
      console.log("Error in handleSubmit: ", error);
    }
  };
  const toggleSchedule = () => {
    setScheduleModalVisible(!scheduleModalVisible);
  };
  const toggleEmiCalculator = () => {
    setEmiModalVisible(!emiModalVisible);
  };
  //   console.log('Watch Values', watch());
  const convertToLAN = async (data) => {
    try {
      setAddLoading(true);

      const res = await ConvertLead(
        data,
        setPostData,
        alert,
        setAlert,
        navigation,
        productMappingData
      );
      //   console.log('Res Lead Convert', res);
      if (res && Object.keys(res).length > 0) {
        setConversionResponse(res);
        setCurrentPosition((prev) => prev + 1);
      }
      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);

      console.log("Convert to LAN", error);
    }
  };
  return (
    <View style={addLeadStyle.container}>
      {addLoading && (
        <View style={addLeadStyle.loaderView}>
          <ActivityIndicator size="large" color={customTheme.colors.primary} />
        </View>
      )}
      <CustomAlert
        visible={alert.visible}
        onClickYes={alert.onClickYes}
        title={alert.title}
        confirmBtnLabel={alert.confirmBtnLabel}
        ionIconName={alert.ionIconName}
        cancelBtnLabel={alert.cancelBtnLabel}
        onDismiss={alert.onDismiss}
      />
      {globalConstants.RoleNames.RM === empRole && (
        <Stepper
          steps={steps}
          totalSteps={2}
          currentPosition={currentPosition}
        />
      )}
      {isFormEditable && currentPosition !== 2 && (
        <LeadActivities
          id={id}
          mobileNumber={watch().MobilePhone}
          leadStatus={watch().Status}
          onScheduleClicked={toggleSchedule}
          onEmiCalculatorClicked={toggleEmiCalculator}
        />
      )}
      {currentPosition !== 1 && currentPosition !== 2 && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginRight: verticalScale(20),
            marginTop: verticalScale(20),
          }}
        >
          <StatusCard
            status={
              watch()?.Status == "Lead Pending" ? leadStatus : watch()?.Status
            }
          />
        </View>
      )}
      {currentPosition === 0 && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
          keyboardVerticalOffset={Platform.select({
            ios: 125,
            android: 500,
          })}
        >
          <ScrollView>
            {globalConstants.RoleNames.DSA !== empRole &&
              globalConstants.RoleNames.UGA !== empRole && (
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
                  dsaBrJnMasterData={dsaBrJnMasterData}
                  isFormEditable={isFormEditable}
                  teamHeirarchyByUserId={teamHeirarchyByUserId}
                />
              )}
            <LeadPersonalDetails
              leadMetadata={leadMetadata}
              control={control}
              setValue={setValue}
              collapsedError={hasErrors}
              dsaBrJnMasterData={dsaBrJnMasterData}
              pincodeMasterData={pincodeMasterData}
              teamHeirarchyMasterData={teamHeirarchyMasterData}
              teamHeirarchyByUserId={teamHeirarchyByUserId}
              dsaBrJn={dsaBrJnData}
              watch={watch}
              isFormEditable={isFormEditable}
            />
            <LeadAdditionalDetails
              leadMetadata={leadMetadata}
              control={control}
              setValue={setValue}
              teamHeirarchyByUserId={teamHeirarchyByUserId}
              productMapping={productMappingData}
              watch={watch}
              collapsedError={hasErrors}
              isFormEditable={isFormEditable}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {currentPosition === 1 && (
        <MobileOtpConsent
          LeadId={id}
          // leadMetadata={leadMetadata}
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
          setPostData={setPostData}
          postData={postData}
          isMobileNumberChanged={isMobileNumberChanged}
          setIsMobileNumberChanged={setIsMobileNumberChanged}
          coolingPeriodTimer={coolingPeriodTimer}
          setCoolingPeriodTimer={setCoolingPeriodTimer}
        />
      )}
      {currentPosition === 2 && (
        <LeadConverted
          handleConvertButton={handleConvertButton}
          LeadCaptureData={conversionResponse}
        />
      )}
      <View style={addLeadStyle.buttonContainer}>
        {currentPosition === 0 && (
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
        )}
        {currentPosition === 1 && (
          <>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <View>
                <Button
                  mode="outlined"
                  style={{ borderColor: customTheme.colors.primary }}
                  onPress={handlePrevSubmit}
                >
                  Previous
                </Button>
              </View>
              <View>
                <Button
                  mode={"contained"}
                  onPress={handleSubmit(convertToLAN)}
                  disabled={addLoading || !watch().OTP_Verified__c}
                >
                  Submit
                </Button>
              </View>
            </View>
          </>
        )}
      </View>
      <ScheduleMeetComponent
        control={control}
        onDismiss={() => {
          setScheduleModalVisible(!scheduleModalVisible);
        }}
        setValue={setValue}
        cancelBtnLabel={"Close"}
        visible={scheduleModalVisible}
        setAddLoading={setAddLoading}
        leadId={id}
      />
      <EMICalculatorComponent
        control={control}
        cancelBtnLabel={"Close"}
        visible={emiModalVisible}
        onDismiss={() => {
          setEmiModalVisible(!emiModalVisible);
        }}
      />
    </View>
  );
}
