import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title, Subheading } from 'react-native-paper';
import customTheme from '../colors/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import your icon library
import { Logout } from '../../services/Logout';
import { colors } from '../colors';
import Touchable from '../components/TouchableComponent/Touchable';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDsaBrJn,
  getPincodeMaster,
} from '../../store/redux/actions/masterData';
const UnauthorizedScreen = () => {
  const logOutHandler = async () => {
    await Logout();
  };
  const { dsaBrJnData } = useSelector((state) => state.masterData.dsaBrJn);
  const { pincodeMasterData } = useSelector(
    (state) => state.masterData.pincodeMaster
  );
  // console.log('pincodeMasterData', pincodeMasterData);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getDsaBrJn());
    dispatch(getPincodeMaster());
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginTop: 44,
          marginRight: 12,
        }}
      >
        <Touchable onPress={logOutHandler}>
          <Icon name="logout" size={24} color={colors.bgDark} />
          <Text
            style={{
              fontFamily: customTheme.fonts.smallText.fontFamily,
              fontSize: customTheme.fonts.smallText.fontSize,
            }}
          >
            Logout
          </Text>
        </Touchable>
      </View>
      <View style={styles.container}>
        <Title style={styles.title}>Unauthorized Access</Title>
        <Subheading style={styles.subtext}>
          Please check the permissions and try again
        </Subheading>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: customTheme.fonts.bodyLarge.fontSize,
    fontFamily: customTheme.fonts.bodyLarge.fontFamily,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: customTheme.fonts.labelMedium.fontSize,
    fontFamily: customTheme.fonts.labelMedium.fontFamily,
    textAlign: 'center',
  },
});

export default UnauthorizedScreen;
