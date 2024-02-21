import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  TextInput,
  List,
  Dialog,
  Searchbar,
  Portal,
} from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../colors';
import customTheme from '../../colors/theme';
import { horizontalScale, verticalScale } from '../../../utils/matrcis';
import Touchable from '../TouchableComponent/Touchable';

const SearchCustomDropdown = ({
  control,
  validationProps,
  name,
  label,
  options,
  setValue,
  isDisabled = false,
  DropdownProps,
  required = false,
  isVisible = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [optionData, setOptionData] = useState(options);
  const [searchQuery, setSearchQuery] = useState('');

  const showDialog = () => {
    !isDisabled && setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSearchQuery('');
    setOptionData(options);
  };

  useEffect(() => {
    setOptionData(options);
  }, [options]);

  // --------------------Search handler----------------------------
  // console.log('Options', options);
  const handleSearch = (query) => {
    const formattedQuery = query?.toLowerCase().trim();

    if (formattedQuery) {
      // Filter the data based on the search query
      const filteredList = options?.filter((item) => {
        const itemText = item?.label.toLowerCase();
        if (formattedQuery.length === 1) {
          const itemWords = itemText.split(' ');
          const match = itemWords.some((word) => {
            return word.charAt(0) === formattedQuery;
          });

          return match;
        } else {
          return itemText?.includes(formattedQuery);
        }
      });
      // const filteredList = options.filter((item) => {
      //   const itemText = `${item.label}`.toLowerCase();
      //   return itemText.includes(formattedQuery);
      // });
      setSearchQuery(query);
      setOptionData(filteredList);
    } else {
      // -------Resetting the List View if Search String is empty---------------
      setOptionData(options);
      setSearchQuery(query);
    }
  };

  // -----------------Handle Dropdown Value Selection---------------------
  const handleSelect = (item) => {
    setValue(name, item.value);
    if (name === 'Branch_Name__c') {
      setValue('Employee_Code__c', '');
    } else if (name === 'Channel_Name') {
      setValue('Br_Manager_Br_Name', '');
      setValue('Pincode__c', '');
    }
    // else if (name === 'Constitution__c' && item.value !== 'INDIVIDUAL') {
    //   setValue('FirstName', '');
    //   setValue('LastName', '');
    //   setValue('CurrentResidenceCity__City__s', '');
    //   setValue('DOB__c', null);
    // }
    hideDialog();
  };
  // -------------------------------------------------------------------
  if (!isVisible) {
    return null; // If isVisible is false, the component won't be rendered
  }
  return (
    <View>
      <Controller
        control={control}
        rules={validationProps}
        render={({
          field: { onChange, onBlur, value, name },
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
                  // label={
                  //   <Text>
                  //     {required && <Text style={styles.asterisk}>*</Text>}
                  //     {label}
                  //   </Text>
                  // }
                  value={value ? value : 'Select'}
                  onChangeText={(value) => onChange(value)}
                  onPress={showDialog}
                  editable={false}
                  error={error?.message}
                  disabled={isDisabled}
                  style={styles.textInput}
                  right={
                    <TextInput.Icon
                      icon={visible ? 'chevron-up' : 'chevron-down'}
                      onPress={showDialog}
                    />
                  }
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
                    <Searchbar
                      placeholder="Search"
                      onChangeText={handleSearch}
                      value={searchQuery}
                      mode="view"
                    />
                    <View style={styles.scrollContainer}>
                      {optionData?.length > 0 && (
                        <FlatList
                          data={optionData}
                          keyExtractor={(item, index) =>
                            `${item.value?.toString()}${index}`
                          }
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  scrollContainer: {
    maxHeight: verticalScale(280), // Set the maximum height for the scrollable list
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

export default SearchCustomDropdown;
