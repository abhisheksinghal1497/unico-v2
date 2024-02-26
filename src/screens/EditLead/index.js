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
import Stepper from '../../common/components/StepperComponent/Stepper';
import LeadActivities from '../../common/components/MandatoyToggle';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { getThMaster } from '../../store/redux/actions/teamHeirarchy';
import { useRole } from '../../store/context/RoleProvider';
import { globalConstants } from '../../common/constants/globalConstants';
import Toast from 'react-native-toast-message';
import CustomAlert from '../../common/components/BottomPopover/CustomAlert';
import { createValidationSchema } from '../LeadCapture/components/Handlers/validationSchema';
import { QueryObject } from '../../services/QueryObject';
import { query } from '../../common/constants/Queries';
import { GetBrManagerBrName } from '../LeadCapture/components/Handlers/GetBranchManagerId';
import { GetProductSubTypeName } from '../LeadCapture/components/Handlers/GetProductId';
import { OnSubmitLead } from '../LeadCapture/components/Handlers/onSubmit';
import LeadSourceDetails from '../LeadCapture/components/SourceDetails';
import LeadPersonalDetails from '../LeadCapture/components/PersonalDetails';
import LeadAdditionalDetails from '../LeadCapture/components/AdditionalDetails';
import { addLeadStyle } from '../LeadCapture/styles/AddLeadStyle';
import { useRoute } from '@react-navigation/native';
import { GetRmSmName } from '../LeadCapture/components/Handlers/GetChannelId';

export default function EditLeadScreen({ navigation }) {
  const route = useRoute();
  let leadId = route.params.Id;
  const isOnline = useInternet();
  const empRole = useRole();
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [postData, setPostData] = useState({});
  const [id, setId] = useState(leadId);
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

  const getLeadData = async () => {
    try {
      setAddLoading(true);
      let leadData = {};
      if (isOnline) {
        let leadById = await QueryObject(query.getLeadByIdQuery(id));
        leadData =
          leadById?.records?.length > 0 ? { ...leadById?.records[0] } : {};
        console.log('isOnline', leadData, id);
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
        type: 'error',
        text1: JSON.stringify(error),
        position: 'top',
      });
      // navigation.goback();
      console.log('Error getLeadData', error);
    }
  };
  useEffect(() => {
    getLeadData();
  }, [id]);

  useEffect(() => {
    dispatch(getProductMapping());
    dispatch(getLeadMetadata());
    dispatch(getDsaBrJn());
    dispatch(getCustomerMaster());
    dispatch(getThMaster());
    dispatch(getPincodeMaster());
    setHideBottomTab(true);
  }, []);

  const defaultValues = {};
  const checkOwner = (teamHeirarchyByUserId) => {
    if (id && id.length > 0) {
      if (postData?.OwnerId === teamHeirarchyByUserId?.Employee__c) {
        setFormEditable(false);
        return;
      }
    }
    setFormEditable(true);
  };

  useEffect(() => {
    checkOwner();
  }, [id, teamHeirarchyByUserId]);

  useEffect(() => {
    if (Object.keys(postData).length > 0) {
      let data = { ...postData };

      let getChannelNameByIdOrName = () => {
        return data?.Channel_Name__c && data?.Channel_Name__c.length > 0
          ? dsaBrJnData?.find(
              (value) =>
                value.Account__r.Name === data.Channel_Name__c ||
                value.Account__c === data.Channel_Name__c
            )?.Account__r.Name
          : '';
      };
      data.Channel_Name = getChannelNameByIdOrName();
      data.RM_SM_Name = GetRmSmName(
        teamHeirarchyMasterData,
        data.RM_SM_Name__c
      );
      //   console.log('Data', data);
      data.Br_Manager_Br_Name = GetBrManagerBrName(
        teamHeirarchyMasterData,
        data.Branch_Manager__c
      );
      data.ProductLookup = GetProductSubTypeName(
        productMappingData,
        data.ProductLookup__c
      );

      reset({ ...data });
    }
  }, [postData]);
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
  // Set Form Editable Logic Below According to owner Id and Created By Field
  // useEffect(() => {
  //   const status = watch().Status;
  //   if (
  //     status === 'Closed' ||
  //     status === 'Converted' ||
  //     status === 'Rejected'
  //   ) {
  //     setFormEditable(false);
  //   } else {
  //     setFormEditable(true);
  //   }
  // }, [watch().Status]);

  useEffect(() => {
    setHasErrors(Object.keys(errors).length > 0);
  }, [errors]);

  const onSubmit = async (data) => {
    try {
      setAddLoading(true);
      // Toast.show({
      //   type: 'success',
      //   text1: 'Lead created successfully',
      //   position: 'top',
      // });
      await OnSubmitLead(
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
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled
          keyboardVerticalOffset={Platform.select({
            ios: 125,
            android: 500,
          })}
        >
          {isFormEditable && <LeadActivities />}
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
                isFormEditable={isFormEditable}
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
}
