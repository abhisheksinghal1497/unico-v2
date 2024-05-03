import { View, Text, Animated, FlatList, StyleSheet } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import SlideScreen from './SlideScreen';
import Pagination from './Pagination';
import { globalConstants } from '../../../common/constants/globalConstants';

// ---------------------------------
const Carousel = ({ pdImageMetaData, nestedIndexPDQues, update }) => {
  const [index, setIndex] = useState(0);
  const [paginationData, setPaginationData] = useState([]);
  const [caraouselData, setCaraouselData] = useState(pdImageMetaData);
  // useEffect(() => {
  //   let filteredData = pdImageMetaData?.filter(
  //     (imageData) =>
  //       imageData.respType === globalConstants.dynamicFormDataTypes.file
  //   );

  //   setCaraouselData(filteredData);
  // }, [pdImageMetaData]);
  // console.log('pdImageMetaData', pdImageMetaData);
  const scrollX = useRef(new Animated.Value(0)).current;

  //   -----------------------
  const handleOnScroll = (event) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };
  useEffect(() => {
    const pagination = pdImageMetaData.filter(
      (question) =>
        question.respType === globalConstants.dynamicFormDataTypes.file
    );
    setPaginationData(pagination);
  }, []);
  // ----------------------------
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // -----------------
  const renderItem = ({ item, index }) => {
    // return <Text>{JSON.stringify(item)}</Text>;
    // console.log('Index', index, item);
    return (
      // item.respType === globalConstants.dynamicFormDataTypes.file && (
      <SlideScreen
        section={item}
        update={update}
        nestedIndexPDQues={nestedIndexPDQues + index}
      />
      // )
    );
  };
  //   -------------------------
  return (
    <View style={styles.container}>
      <FlatList
        data={caraouselData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination data={paginationData} scrollX={scrollX} index={index} />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
