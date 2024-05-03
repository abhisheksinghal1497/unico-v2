import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { screens } from '../common/constants/screen';
import CustomNavigationBar from './customNavigationBar';
import SfWebView from '../screens/WebView';
import { Platform } from 'react-native';
import LeadList from '../screens/LeadList';
import AddLead from '../screens/LeadCapture';
import EditLeadScreen from '../screens/EditLead';
import MeetingList from '../screens/MeetingList';
import PdListScreen from "../screens/PD/PdListScreen";

const Stack = createStackNavigator();

const SharedStackNavigator = () => {
  const route = useRoute();
  const { defaultScreen } = route.params || {};
  console.log(route)
  return (
    // ----------------------Shared Stack--------------------------------------
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
      }}
    >
      {
        /* Add Dynamic screens here */
        defaultScreen === screens.leadList ? (
          <Stack.Screen name={screens.leadList} component={LeadList} />
        ): defaultScreen === screens.pdList ? (
          <Stack.Screen name={screens.pdList} component={PdListScreen} />
        ) : defaultScreen === screens.meetingList ? (
          <Stack.Screen name={screens.meetingList} component={MeetingList} />
        ) : defaultScreen === screens.WebView ? (
          <Stack.Screen
            name={screens.WebView}
            component={SfWebView}
            options={() => {
              return {
                headerShown: Platform.OS === 'ios' ? true : false,
              };
            }}
          />
        ) : null
      }
      {
        /* Add Common screens here */
        <>
          <Stack.Screen name={screens.addLead} component={AddLead} />
          <Stack.Screen name={screens.editLead} component={EditLeadScreen} />
        </>
      }
    </Stack.Navigator>
  );
};

export default SharedStackNavigator;
