import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  TextInput,
  List,
  Dialog,
  Portal,
} from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { horizontalScale, verticalScale } from '../../../../utils/matrcis';
import { colors } from '../../../colors';
import Touchable from '../../TouchableComponent/Touchable';
import customTheme from '../../../colors/theme';
import { debounce } from 'lodash';

const DynamicDropdown = ({
  control,
  validationProps,
  name,
  label,
  value,
  options,
  renderForm,
  setRenderForm,
  setValue,
  watch,
  field,
  isDisabled = false,
  required = false,
  isVisible = true,
  DropdownProps,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const showDialog = () => {
    !isDisabled && setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };

  // ---------------Handle Select---------------------
  const handleSelect = (item) => {
    //setValue(name, item.value);
    console.log('critia list if block fiels', field);
    if (field?.containDependentFields) {
      console.log('critia list if block');
      setRenderForm(!renderForm);
      //setRenderDependentField(!renderDependentField);
    }
    closeMenu();
  };
  if (!isVisible) {
    return null; // If isVisible is false, the component won't be rendered
  }
  return (
    <View>
      <Controller
        control={control}
        rules={validationProps}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View style={styles.container}>
              <View style={styles.labelContainer}>
                <Text>
                  {required && <Text style={styles.asterisk}>* </Text>}
                  {label}
                </Text>
              </View>
              <Touchable disabled={isDisabled} onPress={showDialog}>
                <TextInput
                  id={name}
                  onBlur={onBlur}
                  value={value ? value : 'Select'}
                  onChangeText={(value) => {
                    onChange(value);
                  }}
                  error={error?.message}
                  editable={false}
                  disabled={isDisabled}
                  style={styles.textInput}
                  // on={() => showDialog}
                  right={
                    <TextInput.Icon
                      icon={visible ? 'chevron-up' : 'chevron-down'}
                      onPress={showDialog}
                    />
                  }
                  {...rest}
                />
                {error?.message && (
                  <Text style={styles.errorMessage}>{error?.message}</Text>
                )}
              </Touchable>
              <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                  <Dialog.Title>
                    <Text style={styles.dialogHeader}>{label}</Text>
                  </Dialog.Title>
                  <Dialog.ScrollArea>
                    <View style={styles.scrollContainer}>
                      {options?.length > 0 && (
                        <FlatList
                          data={options}
                          keyExtractor={(item) => item.value?.toString()}
                          renderItem={({ item }) => {
                            return (
                              <List.Item
                                title={item?.label}
                                titleNumberOfLines={2}
                                onPress={() => {
                                  handleSelect(item);
                                  onChange(item?.value);
                                }}
                              />
                            );
                          }}
                        />
                      )}
                    </View>
                  </Dialog.ScrollArea>
                  <Dialog.Actions>
                    <Button mode="text" onPress={hideDialog}>
                      Cancel
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          );
        }}
        name={name}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(8),
    marginVertical: verticalScale(6),
    paddingBottom: 0,
  },
  asterisk: {
    color: colors.asteriskRequired,
  },
  scrollContainer: {
    maxHeight: verticalScale(280),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  errorMessage: {
    color: customTheme.colors.error,
    marginTop: verticalScale(2),
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
  dialogHeader: {
    fontFamily: customTheme.fonts.titleMedium.fontFamily,
    fontSize: customTheme.fonts.titleMedium.fontSize,
    fontWeight: customTheme.fonts.titleMedium.fontWeight,
    letterSpacing: customTheme.fonts.titleMedium.letterSpacing,
    lineHeight: customTheme.fonts.titleMedium.lineHeight,
    color: customTheme.colors.primary,
  },
});

// export default React.memo(DynamicDropdown);
export default DynamicDropdown;
