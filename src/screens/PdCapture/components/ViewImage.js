import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import BottomPopover from '../../../common/components/BottomPopover/BottomPopover';
// import { storage } from '../../../store/MMKVStore';

const ViewImage = ({ selectedFile, isFileVisible, toggleFileVisibility }) => {
  return (
    <View>
      <BottomPopover visible={isFileVisible} onDismiss={toggleFileVisibility}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            position: 'absolute',
            zIndex: -1,
          }}
        >
          {/* <Image
            source={
              selectedFile.isBase64
                ? {
                    uri: `data:${
                      selectedFile.fileExtension
                    };base64,${storage.getString(selectedFile.fileName)}`,
                  }
                : { uri: selectedFile.fileUri }
              // { uri: `data:image/jpeg;base64,${storage.getString('Image')}` }
            }
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
            resizeMode="contain"
          /> */}
        </View>
      </BottomPopover>
    </View>
  );
};

export default ViewImage;

const styles = StyleSheet.create({});
