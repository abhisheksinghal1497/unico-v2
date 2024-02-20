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
import { FlatList } from 'react-native-gesture-handler';
import { colors } from '../../colors';
import customTheme from '../../colors/theme';
import { horizontalScale, verticalScale } from '../../../utils/matrcis';
import Touchable from '../TouchableComponent/Touchable';
import { Chip } from 'react-native-paper';

const MultiSelectDropdown = ({
  control,
  validationProps,
  name,
  label,
  options,
  setValue,
  defaultValue,
  isDisabled = false,
  DropdownProps,
  getValues,
  required = false,
  isVisible = true,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
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

  useEffect(() => {
    const arrayOfValues = getValues(name);
    const newArray = options.filter((item) =>
      arrayOfValues.includes(item.value)
    );
    setSelectedItems(newArray);
  }, []);

  // --------------------------Search handler---------------------------
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
          return itemText.includes(formattedQuery);
        }
      });

      setSearchQuery(query);
      setOptionData(filteredList);
    } else {
      // -------Resetting the List View if Search String is empty---------------
      setOptionData(options);
      setSearchQuery(query);
    }
  };

  //  ---------------------Select Handler---------------------
  const handleSelect = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = prevSelectedItems.includes(item)
        ? prevSelectedItems.filter(
            (prevValue) => prevValue?.value !== item.value
          )
        : [...prevSelectedItems, item];
      const updatedValues = updatedSelectedItems.map((item) => item.value);

      setTimeout(() => {
        setValue(name, updatedValues);
      });

      return updatedSelectedItems;
    });
  };
  // ---------------------------------
  if (!isVisible) {
    return null;
  }
  //console.log("DefaultValues", defaultValue);
  return (
    <View>
      <Controller
        control={control}
        rules={validationProps}
        render={({
          field: { onChange, onBlur, value, name },
          fieldState: { error },
        }) => {
          //console.log("value", value);
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
                  value={
                    value?.length > 0
                      ? `${value?.length} Item Selected`
                      : 'Select'
                  }
                  onChangeText={(value) => field.onChange(value)}
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
                  {...rest}
                />
              </Touchable>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginVertical: verticalScale(5),
                }}
              >
                {selectedItems?.map((item, index) => (
                  <Chip
                    key={index}
                    icon="close-circle"
                    onPress={() => handleSelect(item)}
                    style={{
                      marginRight: horizontalScale(4),
                      marginVertical: verticalScale(3),
                    }}
                  >
                    {item.label}
                  </Chip>
                ))}
              </View>

              {error?.message && (
                <Text style={styles.errorMessage}>{error?.message}</Text>
              )}

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
                          keyExtractor={(item) => item.value}
                          renderItem={({ item }) => {
                            return (
                              <List.Item
                                title={item.label}
                                titleNumberOfLines={2}
                                onPress={() => {
                                  handleSelect(item);
                                }}
                                right={() => (
                                  <List.Icon
                                    color={customTheme.colors.primary}
                                    icon={
                                      value?.includes(item.value)
                                        ? 'checkbox-marked'
                                        : 'checkbox-blank-outline'
                                    }
                                  />
                                )}
                              />
                            );
                          }}
                        />
                      )}
                    </View>
                  </Dialog.ScrollArea>

                  <Dialog.Actions>
                    <Button
                      mode="text"
                      style={{ borderRadius: customTheme.shape.roundness }}
                      onPress={hideDialog}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      style={{ borderRadius: customTheme.shape.roundness }}
                      onPress={hideDialog}
                    >
                      Done
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
export default MultiSelectDropdown;
