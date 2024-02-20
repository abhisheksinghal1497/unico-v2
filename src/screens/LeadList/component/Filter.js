import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dialog, List, Portal, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../../../common/colors';
import { LeadListStyles } from '../styles/LeadListStyles';
import { screens } from '../../../common/constants/screen';
import Touchable from '../../../common/components/TouchableComponent/Touchable';

const Filter = ({
  pickerData,
  openMenu,
  closeMenu,
  visible,
  handleStatusDropDownData,
  listView,
  navigation,
  isOnline,
}) => {
  return (
    <>
      <View style={LeadListStyles.menuViewContainer}>
        {isOnline && (
          <Touchable
            onPress={openMenu}
            style={LeadListStyles.anchorViewContainer}
          >
            <Text style={LeadListStyles.statusTextStyle} numberOfLines={1}>
              {listView?.label}
            </Text>

            <Icon
              name="down"
              size={12}
              color={colors.black}
              style={LeadListStyles.iconViewStyle}
            />
          </Touchable>
        )}
        <Portal>
          <Dialog visible={visible} onDismiss={closeMenu}>
            <Dialog.Title>
              <Text>Filter</Text>
            </Dialog.Title>
            <Dialog.ScrollArea>
              <List.Section>
                <ScrollView style={LeadListStyles.scrollContainer}>
                  {/* <List.Item
                    onPress={() => handleStatusDropDownData("")}
                    key={"All"}
                    title={"All"}
                  /> */}
                  {pickerData &&
                    pickerData.map((item) => (
                      <List.Item
                        onPress={() => handleStatusDropDownData(item)}
                        key={item.developerName}
                        titleNumberOfLines={2}
                        title={item.label}
                        style={
                          listView?.label === item.label
                            ? { backgroundColor: colors.selectedItemColor }
                            : null
                        }
                      />
                    ))}
                </ScrollView>
              </List.Section>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button mode="text" onPress={closeMenu}>
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={LeadListStyles.newLeadBtn}>
          <Button
            style={LeadListStyles.button}
            icon="account-plus-outline"
            mode="contained"
            onPress={() => navigation.navigate(screens.addLead)}
          >
            New Lead
          </Button>
        </View>
      </View>
    </>
  );
};

export default Filter;
