import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import {
  FormControl,
  component,
} from '../../../common/components/FormComponents/FormControl';
import { GetPicklistValues } from '../../../common/functions/getPicklistValues';
import { colors } from '../../../common/colors';
import customTheme from '../../../common/colors/theme';
import { Logout } from '../../../services/Logout';

const SessionExpiredModal = ({
  visible,
  onClose,
  control,
  leadMetadata,
  onCancel,
  handleSubmit,
  setValue,
  watch,
  isDisabled,
}) => {
 const logoutHandler = async()=>{
 await Logout();
}

  return (
    <Portal>
      <Dialog visible={true} onDismiss={onClose}>
        <Dialog.Icon size={38} icon="alert" />
        <Dialog.Title style={styles.title}>
          {'Session Timeout'}
        </Dialog.Title>
        <Dialog.Content>
        
          <Text>Your seesion has expired.Please log in again  </Text>
        </Dialog.Content>
        <Dialog.Actions> 
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Button
            mode="contained"
            onPress={onCancel}
            textColor={colors.newStatus}
            style={{ borderRadius: 6, backgroundColor: 'white' }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={logoutHandler}
            textColor={colors.white}
            style={{ borderRadius: 6, backgroundColor: '#8B0000',marginLeft:9 }}
          >
            Log Out
          </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
});

export default SessionExpiredModal;

