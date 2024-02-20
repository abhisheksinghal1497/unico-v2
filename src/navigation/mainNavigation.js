import * as React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { screens } from '../common/constants/screen';
import { colors } from '../common/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SharedStackNavigator from './sharedStackNavigation';
import customTheme from '../common/colors/theme';
import SfWebView from '../screens/WebView';
import { useDispatch } from 'react-redux';
import { useInternet } from '../store/context/Internet';
import { getLeadMetadata } from '../store/redux/actions/leadMetadata';
import { SyncHandler } from '../utils/syncHandler';
import { oauth } from 'react-native-force';
import { useEffect } from 'react';
import { getTeamHeirarchyByUserId } from '../store/redux/actions/teamHeirarchy';
import { ROLES } from '../common/constants/globalConstants';
import UnauthorizedScreen from '../common/constants/unAuthScreen';
import { useRole } from '../store/context/RoleProvider';

const Tab = createMaterialBottomTabNavigator();

const navOptionHandler = () => ({
  headerShown: false,
});
export const BottomTabContext = React.createContext({
  hideBottomTab: false,
});

// ----------------------Main Tab Navigator---------------------------------
const MainNavigator = () => {
  const [hideBottomTab, setHideBottomTab] = React.useState(false);
  // const { teamHeirarchyByUserId } = useSelector((state) => state.teamHeirarchyByUserId);

  // const empRole = GetEmployeeRole(teamHeirarchyByUserId);
  const empRole = useRole();
  // console.log('empRole', empRole);
  const dispatch = useDispatch();
  const isOnline = useInternet();
  useEffect(() => {
    // dispatch(getCredentials());
    dispatch(getTeamHeirarchyByUserId());
    // dispatch(getLeadMetadata());
    if (isOnline) {
      oauth.getAuthCredentials(
        async (res) => {
          await SyncHandler();
        },
        (err) => {
          console.log('Error getting Auth Credentials', err);
        }
      );
    }
  }, [isOnline]);

  // const initialRouteName = ROLES.LEAD_CAPTURE.includes(empRole)
  //   ? screens.leadList
  //   : ROLES.PD_LIST.includes(empRole)
  //   ? screens.pdList
  //   : null;

  const tabsForLead = (
    <>
      <Tab.Screen
        name={screens.leadListStack}
        component={
          ROLES.LEAD_CAPTURE.includes(empRole)
            ? SharedStackNavigator
            : UnauthorizedScreen
        }
        options={navOptionHandler}
        initialParams={{
          defaultScreen: screens.leadList,
        }}
      />
      {ROLES.WEBVIEW.includes(empRole) && (
        <Tab.Screen
          name={screens.WebViewStack}
          component={SfWebView}
          options={() => {
            return {
              tabBarStyle: { display: 'none' },
              tabBarVisible: false,
              headerShown: true,
            };
          }}
          // initialParams={{ employeeRole: empRole }}
        />
      )}
    </>
  );
  // const tabsForUnAuthUser = (
  //   <>
  //     <Tab.Screen
  //       name={screens.leadListStack}
  //       component={UnauthorizedScreen}
  //       options={navOptionHandler}
  //       initialParams={{
  //         defaultScreen: screens.leadList,
  //       }}
  //     />
  //   </>
  // );

  // const tabsForPD = (
  //   <>
  //     <Tab.Screen
  //       name={screens.pdListStack}
  //       component={
  //         //SharedStackNavigator
  //         // ROLES.PD_LIST.includes(empRole)
  //         //   ?
  //           SharedStackNavigator
  //           // : unauthorizedscreen
  //       }
  //       options={navOptionHandler}
  //       initialParams={{
  //         defaultScreen: screens.pdList,
  //       }}
  //     />
  //     <Tab.Screen
  //       name={screens.cvListStack}
  //       component={
  //         //SharedStackNavigator
  //         // ROLES.PD_LIST.includes(empRole)
  //         //   ?
  //           SharedStackNavigator
  //           // : UnauthorizedScreen
  //       }
  //       options={navOptionHandler}
  //       initialParams={{
  //         defaultScreen: screens.cvList,
  //       }}
  //     />
  //     {/* <Tab.Screen
  //       name={screens.WebViewStack}
  //       component={SfWebView}
  //       options={() => {
  //         return {
  //           tabBarStyle: { display: "none" },
  //           tabBarVisible: false,
  //           headerShown: true,
  //         };
  //       }}
  //       initialParams={{ employeeRole: empRole }}
  //     /> */}
  //   </>
  // );

  return (
    <BottomTabContext.Provider value={{ hideBottomTab, setHideBottomTab }}>
      <Tab.Navigator
        initialRouteName={screens.leadList}
        activeColor={colors.tertiary}
        inactiveColor={colors.gray250}
        barStyle={{
          ...customTheme.tab.barStyle,
          display: hideBottomTab ? 'none' : 'flex',
        }}
        compact={true}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === screens.AddLeadStack) {
              iconName = focused ? 'person-add' : 'person-add-outline';
            } else if (rn === screens.leadListStack) {
              iconName = focused ? 'list' : 'list-outline';
            } else if (rn === screens.WebViewStack) {
              iconName = focused ? 'globe' : 'globe-outline';
            } else if (rn === screens.pdListStack) {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (rn === screens.cvListStack) {
              iconName = focused ? 'reader' : 'reader-outline';
            }
            // else if (rn === screens.pdList) {
            //   iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            // }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={20} color={color} />;
          },
          tabBarHideOnKeyboard: true,
        })}
      >
        {/* ----------------Tab1---------------------- */}
        {tabsForLead}
      </Tab.Navigator>
    </BottomTabContext.Provider>
  );
};
export default MainNavigator;
