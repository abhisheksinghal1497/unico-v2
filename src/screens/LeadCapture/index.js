import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useContext, useState } from 'react';
import { useInternet } from '../../store/context/Internet';
import { BottomTabContext } from '../../navigation/mainNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  getBankBranchMaster,
  getCustomerMaster,
  getDsaBrJn,
  getLocationBrJnMaster,
  getPincodeMaster,
  getProductMapping,
} from '../../store/redux/actions/masterData';
import { getLeadMetadata } from '../../store/redux/actions/leadMetadata';
import { useForm } from 'react-hook-form';
import customTheme from '../../common/colors/theme';
import { addLeadStyle } from './styles/AddLeadStyle';
import Stepper from '../../common/components/StepperComponent/Stepper';
import LeadActivities from '../../common/components/MandatoyToggle';
import LeadSourceDetails from './components/SourceDetails';
import LeadPersonalDetails from './components/PersonalDetails';
import { ScrollView } from 'react-native-gesture-handler';
import LeadAdditionalDetails from './components/AdditionalDetails';
import { Button } from 'react-native-paper';
import { getThMaster } from '../../store/redux/actions/teamHeirarchy';
import { OnSubmitLead } from './components/Handlers/onSubmit';
import { useRole } from '../../store/context/RoleProvider';
import { globalConstants } from '../../common/constants/globalConstants';
import { createValidationSchema } from './components/Handlers/validationSchema';
import { validatePincode } from './components/Handlers/validatePincode';
import Toast from 'react-native-toast-message';
import CustomAlert from '../../common/components/BottomPopover/CustomAlert';

const AddLead = () => {
  // --------Define Variables Here----------//
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    title: '',
    confirmBtnLabel: '',
    cancelBtnLabel: '',
    onClickYes: () => {},
    onDismiss: () => {},
    ionIconName: '',
  });
  const isOnline = useInternet();
  const empRole = useRole();
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [postData, setPostData] = useState({});
  const [id, setId] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isFormEditable, setFormEditable] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const steps = ['Basic details', 'OTP Verification', 'Lead Converted'];
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

  console.log('Lead Meta Data', productMappingData);
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
  const defaultValues = {
    LeadSource: '',
    Status: 'New Lead',
    RM_SM_Name: teamHeirarchyByUserId
      ? teamHeirarchyByUserId?.Employee__r.Name
      : '',
    // Referral_Employee_Code__c: '',
    RM_SM_Name__c: '',
    Channel_Name__c: '',
    Channel_Name: '',
    Branch_Name__c: '',
    // BranchCode__c: '', No need to update as it is a formula field
    Employee_Code__c: '',
    Customer_Name__c: '',
    DSA_Code__c: '',
    Bank_Branch__c: '', // Branch Name of User Logged in
    Branch_Manager__c: '', //
    Br_Manager_Br_Name: '',
    //-----------Personal details--------------//
    Customer_Profile__c: '',
    // Constitution__c: '',
    MobilePhone: '',
    Alternative_Mobile_Number__c: '',
    FirstName: '',
    MiddleName: '',
    LastName: '',
    Email: '',
    Residential_Address__c: '',
    Pincode__c: '',
    //--------------Loan Details------------//
    Product__c: '',
    // Product_Sub_Type__c: '',
    ProductLookup__c: '',
    ProductLookup: '',
    Property_Identified__c: '',
    // Property_Category__c: '',
    Requested_loan_amount__c: '',
    Requested_tenure_in_Months__c: '',
    // ConsentType__c: 'OTP Consent',
    // Is_OTP_Limit_Reached__c: false,
    // OTP_Verified__c: false,
  };
  const validationSchema = createValidationSchema(pincodeMasterData);
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
    mode: 'all',
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

      // const GetBrFromBankBrMaster = (pincodeMasterData, branchCode) => {
      //   try {
      //     const branch = pincodeMasterData.find(
      //       (br) => br?.Bank_Branch__r?.BrchCode__c === branchCode
      //     );
      //     return branch || null;
      //   } catch (error) {
      //     console.error('Error in GetBrFromBankBrMaster:', error);
      //     return null;
      //   }
      // };

      // let userBranch = GetBrFromBankBrMaster();

      // await validatePincode(
      //   data,
      //   setId,
      //   id,
      //   teamHeirarchyByUserId,
      //   pincodeMasterData,
      //   dsaBrJnData,
      //   empRole,
      //   isOnline,
      //   setPostData,
      //   userBranch,
      //   userLocation,
      //   alertVisible,
      //   setAlertVisible,
      //   setAddLoading
      // );

      OnSubmitLead(
        data,
        setId,
        id,
        teamHeirarchyByUserId,
        dsaBrJnData,
        empRole,
        isOnline,
        setPostData,
        teamHeirarchyMasterData,
        productMappingData
      );

      setAddLoading(false);
      // setIsPincodeConfirmed(false);
    } catch (error) {
      setAddLoading(false);

      Toast.show({
        type: 'error',
        text1: 'Failed to create lead',
        position: 'top',
      });
      console.log('Error in handleSubmit: ', error);
    }
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
      <CustomAlert
        visible={alertVisible.visible}
        title={alertVisible.title}
        confirmBtnLabel={alertVisible.confirmBtnLabel}
        cancelBtnLabel={alertVisible.cancelBtnLabel}
        onDismiss={alertVisible.onDismiss}
        onClickYes={alertVisible.onClickYes}
        ionIconName={alertVisible.ionIconName}
      />
      {currentPosition === 0 && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
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
      <View style={addLeadStyle.buttonContainer}>
        <Button
          mode={!isFormEditable ? 'contained' : 'outlined'}
          style={addLeadStyle.cancelButton}
          disabled={!isFormEditable}
          onPress={handleSubmit(onSubmit)}
          icon="play"
          contentStyle={{ flexDirection: 'row-reverse' }}
        >
          Next
        </Button>
      </View>
      {/* <Text>AddLead</Text> */}
    </View>
  );
};

export default AddLead;
