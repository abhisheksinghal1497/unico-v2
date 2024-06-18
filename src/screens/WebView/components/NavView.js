// import { IconButton } from '@rneui/base';
import React, { useState } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../common/colors";
import { IconButton } from "react-native-paper";
import { screens } from "../../../common/constants/screen";
import { Logout } from "../../../services/Logout";
import customTheme from "../../../common/colors/theme";
import {
  ROLES,
  globalConstants,
} from "../../../common/constants/globalConstants";
import { useRole } from "../../../store/context/RoleProvider";
import CustomAlert from "../../../common/components/BottomPopover/CustomAlert";

const NavView = ({ onBackPress, onForwardPress, onReload }) => {
  const navigation = useNavigation();
  const [logoutAlert, setLogoutAlert] = useState(false);
  const toggleLogoutAlert = () => {
    setLogoutAlert(!logoutAlert);
  };
  const logOutHandler = async () => {
    await Logout();
  };
  const empRole = useRole();
  return (
    <View style={styles.container}>
      <CustomAlert
        visible={logoutAlert}
        onClickYes={logOutHandler}
        onDismiss={toggleLogoutAlert}
        title={"Are you sure, You want to logout?"}
        ionIconName={"exit-outline"}
        confirmBtnLabel={"Yes"}
        cancelBtnLabel={"No"}
      />
      <View style={{ flexDirection: "row" }}>
        <IconButton
          iconColor={colors.appBarIconText}
          icon="arrow-left-drop-circle-outline"
          onPress={onBackPress}
          size={30}
          // disabled={!canGoBack}
        />

        <IconButton
          onPress={onReload}
          size={30}
          iconColor={colors.appBarIconText}
          icon="reload"
          // style={{ marginHorizontal: 0 }}
        />

        <IconButton
          onPress={onForwardPress}
          size={30}
          iconColor={colors.appBarIconText}
          icon="arrow-right-drop-circle-outline"
        />
      </View>
      <View>
        {/* <IconButton
          onPress={logOutHandler}
          size={30}
          iconColor={colors.appBarIconText}
          icon="logout"
        /> */}
      </View>
      <View style={{ flexDirection: "row" }}>
        {empRole === globalConstants.RoleNames.ACM ||
        empRole === globalConstants.RoleNames.BCM ||
        empRole === globalConstants.RoleNames.RCM ? (
          <IconButton
            onPress={() => {
              setLogoutAlert(true);
            }}
            size={30}
            iconColor={colors.appBarIconText}
            icon="logout"
          />
        ) : (
          <IconButton
            onPress={() => {
              navigation.navigate(screens.leadList);
            }}
            size={30}
            iconColor={colors.appBarIconText}
            icon="home"
          />
        )}
      </View>
    </View>
  );
};

export default NavView;

const styles = StyleSheet.create({
  container: {
    height: "7%",
    backgroundColor: customTheme.colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginLeft: 10,
    padding: 14,
    paddingHorizontal: 15,
  },
});
