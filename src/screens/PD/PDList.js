import React, { useEffect, useContext, useState } from "react";
import { View } from "react-native";
import { horizontalScale, verticalScale } from "../../utils/matrcis";
import customTheme from "../../common/colors/theme";
import DynamicForm from "../../common/components/DynamicFormComponents/DynamicForm";
import { BottomTabContext } from "../../navigation/mainNavigation";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useInternet } from "../../store/context/Internet";
import { ActivityIndicator } from "react-native-paper";
import { PdListStyles } from "./styles/PdListStyles";
import { screens } from "../../common/constants/screen";
import ErrorScreen from "../Lead/component/ErrorScreen";
import { getPDQuestionJson } from "./Handlers/getPDQnJson";
const PDList = () => {
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [pdJson, setPdJson] = useState([]);
  const [hasError, setErrorState] = useState(false);
  const [pdLoading, setPDLoading] = useState(false);
  const isOnline = useInternet();
  const [renderForm, setRenderForm] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { Id, IsCompleted, LoanApplStatus } = route.params;
  useEffect(() => {
    setHideBottomTab(true);
  }, []);

  const getQnFxn = async (Id, isOnline) => {
    try {
      setPDLoading(true);
      const getQn = await getPDQuestionJson(Id, isOnline);
      consol.log(getQn,'getQn data here')
      setPdJson(getQn);
      setErrorState(false);
      setPDLoading(false);
    } catch (error) {
      setErrorState(true);
      setPDLoading(false);
    }
  };
  useEffect(() => {
    getQnFxn(Id, isOnline);
  }, [Id, isOnline]);
  // ---------------------------

  const onCancelButtonClicked = () => {
    navigation.navigate(screens.pdList);
  };

  // ---------------------------
  return (
    <View
      style={{
        flex: 1,
        paddingTop: verticalScale(12),
        backgroundColor: customTheme.colors.background,
      }}
    >
      {pdLoading && (
        <View style={PdListStyles.loaderView}>
          <ActivityIndicator size="large" color={customTheme.colors.primary} />
        </View>
      )}
      {hasError ? (
        <ErrorScreen message="Error Retrieving Form Data. Please Try Again." />
      ) : (
        <DynamicForm
          formData={pdJson}
          Id={Id}
          formLoading={pdLoading}
          setFormLoading={setPDLoading}
          onCancelButtonClicked={onCancelButtonClicked}
          IsCompleted={IsCompleted}
          LoanApplStatus={LoanApplStatus}
          renderForm={renderForm}
          setRenderForm={setRenderForm}
          formName="PD"
        />
      )}
    </View>
  );
};

export default PDList;
