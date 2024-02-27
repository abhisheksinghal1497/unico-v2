import React, { useEffect, useCallback, useRef, useContext } from 'react';
import { FlatList, View, Keyboard, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {
  getLeadListViews,
  getLeadsByQuery,
} from '../../store/redux/actions/lead';
import { useInternet } from '../../store/context/Internet';
import { SearchLead } from '../../services/SearchLead';
import { LeadListStyles } from './styles/LeadListStyles';
import LeadItem from './component/LeadItem';
import Filter from './component/Filter';
import ErrorScreen from './component/ErrorScreen';
import { ErrorMessage } from '../../common/constants/ErrorConstants';
import { screens } from '../../common/constants/screen';
import customTheme from '../../common/colors/theme';
import { BottomTabContext } from '../../navigation/mainNavigation';
import { QuerySoup } from '../../services/QuerySoup';
import { soupConfig } from '../../common/constants/soupConstants';
import leadSyncUp from '../../store/soups/LeadSoup/LeadSyncUp';
import { globalConstants } from '../../common/constants/globalConstants';
import { useRole } from '../../store/context/RoleProvider';

export default function LeadList({ navigation }) {
  const searchbarRef = useRef(null);
  // const navigation = useNavigation
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [selectedListView, setSelectedListView] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [leadListData, setLeadListData] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pickerValue, setPickerValue] = React.useState([]);
  const isOnline = useInternet();
  const empRole = useRole();
  const dispatch = useDispatch();
  const { hasError, leads, loading } = useSelector(
    (state) => state.leads?.lead
  );
  const { listViews } = useSelector((state) => state.leads.leadListViews);
  // console.log('lead$$$$$$', listViews);

  const getOfflineLeadList = async () => {
    try {
      const offlineLeadData = await QuerySoup(
        soupConfig.lead.soupName,
        soupConfig.lead.queryPath,
        soupConfig.lead.pageSize
      );
      const filteredOffilneData = offlineLeadData?.filter(
        (lead) => lead.__local__ === true
      );

      setLeadListData([...filteredOffilneData]);
      return filteredOffilneData;
    } catch (error) {
      console.log('Error getOfflineLeadList', error);
      return [];
    }
  };

  // console.log('Leads----------->', leads);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setHideBottomTab(false);
      setSearchQuery('');
      Object.keys(selectedListView)?.length > 0 &&
        dispatch(getLeadsByQuery(selectedListView?.query));
    });

    return unsubscribe;
  }, [navigation, selectedListView, isOnline]);

  useEffect(() => {
    const keyboardDismissListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (searchbarRef.current) {
          searchbarRef.current.blur();
        }
      }
    );

    return () => {
      keyboardDismissListener.remove();
    };
  }, []);
  // ---------------------------------------------------------
  useEffect(() => {
    if (!searchQuery) {
      onSearchClearPress();
    }
  }, [leadListData]);

  useEffect(() => {
    if (globalConstants.RoleNames.RM === empRole) {
      setHideBottomTab(false);
    } else {
      setHideBottomTab(true);
    }
  }, []);

  useEffect(() => {
    if (isOnline) {
      setLeadListData(leads?.records);
    } else {
      getOfflineLeadList();
    }
  }, [leads, isOnline]);

  useEffect(() => {
    if (isOnline) {
      setPickerValue(listViews);
      if (listViews?.length > 0) {
        let defaultListView = listViews?.filter(
          (value) => value?.default === true
        );
        setSelectedListView(...defaultListView);
        defaultListView && dispatch(getLeadsByQuery(defaultListView[0]?.query));
      }
    }
  }, [listViews]);
  useEffect(() => {
    isOnline && dispatch(getLeadListViews());
  }, [isOnline]);

  const handleStatusDropDownData = (selectedListView) => {
    try {
      setSelectedListView(selectedListView);
      setVisible(false);

      dispatch(getLeadsByQuery(selectedListView?.query));
    } catch (error) {
      console.log('Error handleStatusDropDownData', error);
    }
  };

  const fetchSearchData = useCallback(
    async (searchString) => {
      try {
        const result = await SearchLead(searchString);
        console.log('Search Result', result);
        setLeadListData(result.searchRecords);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error Fetching data',
          position: 'top',
        });
        console.log('Error Fetching data', error);
      }
    },
    [searchQuery]
  );

  const debounceSearch = async (searchString) => {
    // console.log('Is Online inside Debounce', isOnline);
    if (isOnline) {
      // console.log('Debounce Search');
      await fetchSearchData(searchString);
    } else {
      const formattedQuery = searchString.toLowerCase().trim();

      if (formattedQuery) {
        // Filter the data based on the search query
        const filteredList = leadListData.filter((item) => {
          const itemText = `${item.FirstName} ${item.LastName}`.toLowerCase();
          return itemText.includes(formattedQuery);
        });
        setLeadListData(filteredList);
      }
    }
  };

  const onChangeSearch = async (searchString) => {
    setSearchQuery(searchString);
    if (searchString && searchString.length > 1) {
      // console.log('Search String----', searchString);
      await debounceSearch(searchString);
    }
    if (!searchString) {
      onSearchClearPress();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (listViews?.length === 0 && isOnline) {
      dispatch(getLeadListViews());
    }
    if (searchQuery.length < 1) {
      dispatch(getLeadsByQuery(selectedListView.query));
      await leadSyncUp();
    }
    setRefreshing(false);
  };

  const onSearchClearPress = () => {
    setSearchQuery('');
    if (isOnline) {
      setLeadListData(leads?.records);
    } else {
      getOfflineLeadList();
    }
  };

  const handleRenderItem = (Id) => {
    navigation.navigate(screens.editLead, { Id });
  };
  const renderItem = ({ item }) => {
    return (
      <LeadItem
        leadData={item}
        handleRenderItem={handleRenderItem}
        isOnline={isOnline}
      />
    );
  };

  return (
    <View style={LeadListStyles.container}>
      {loading && !refreshing && (
        <View style={LeadListStyles.loaderView}>
          <ActivityIndicator size="large" color={customTheme.colors.primary} />
        </View>
      )}

      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={LeadListStyles.searchBar}
        onClearIconPress={onSearchClearPress}
        ref={searchbarRef}
      />

      <Filter
        pickerData={pickerValue}
        // statusLabel={status}
        openMenu={openMenu}
        closeMenu={closeMenu}
        visible={visible}
        handleStatusDropDownData={handleStatusDropDownData}
        listView={selectedListView}
        navigation={navigation}
        isOnline={isOnline}
      />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          !loading && <ErrorScreen message={ErrorMessage?.noRecords} />
        }
        data={leadListData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.Id.toString() || String(Math.random())}
        ItemSeparatorComponent={() => (
          <View style={LeadListStyles.itemSeparator} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}
