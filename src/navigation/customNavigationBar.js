import React, { useState } from 'react';
import { Appbar, Menu, Button } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import { View } from 'react-native';
import { colors } from '../common/colors';
import { Logout } from '../services/Logout';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';
import customTheme from '../common/colors/theme';
import { verticalScale } from '../utils/matrcis';
import CustomAlert from '../common/components/BottomPopover/CustomAlert';

export default function CustomNavigationBar({
  route,
  options,
  navigation,
  back,
}) {
  const [logoutAlert, setLogoutAlert] = useState(false);
  // --------------------------------------------
  const toggleLogoutAlert = () => {
    setLogoutAlert(!logoutAlert);
  };
  // -----------------------------------
  const onClickYesLogoutAlert = async () => {
    await Logout();
  };
  // ---------------------

  const logOutHandler = async () => {
    await Logout();
  };

  const title = getHeaderTitle(options, route.name);
  return (
    <>
      <CustomAlert
        visible={logoutAlert}
        onClickYes={onClickYesLogoutAlert}
        onDismiss={toggleLogoutAlert}
        title={'Are you sure, You want to logout?'}
        ionIconName={'exit-outline'}
        confirmBtnLabel={'Yes'}
        cancelBtnLabel={'No'}
      />
      <Appbar.Header>
        {back ? (
          <Appbar.BackAction
            color={colors.appBarIconText}
            onPress={navigation.goBack}
          />
        ) : null}
        {/* <View style={styles.container}>

        <Image
          source={require('../assets/Logo_JPG.jpg')}
          //   size={150}
          resizeMode="contain"
          style={styles.img}
        />
      </View> */}
        {/* <View style={styles.emptyView} /> */}

        <Appbar.Content
          titleStyle={{
            color: colors.appBarIconText,
            paddingStart: verticalScale(12),
          }}
          title={title}
        />
        {/* <Appbar.Action
        style={styles.container}
        icon={() => (
          <Image
            source={require('../assets/Logo_JPG.jpg')}
            //   size={150}
            resizeMode="contain"
            style={styles.img}
          />
        )}
        // centered={true}
        size={80}
      /> */}

        <Appbar.Action
          icon="logout"
          onPress={toggleLogoutAlert}
          color={colors.appBarIconText}
        />
      </Appbar.Header>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: customTheme.colors.background,
    // width: '20%',
    height: '40%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 5,
  },
  //   spinnerStyle: {},
  img: {
    width: 60,
    height: 80,
    borderRadius: 2,
  },
  emptyView: {
    width: '23%', // Adjust this width as needed
  },
});
