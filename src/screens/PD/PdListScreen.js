import React, {
  useEffect,
  useCallback,
  useRef,
  useContext,
  useState,
} from "react";

import { FlatList, View, Keyboard } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Button, Searchbar } from "react-native-paper";
import { debounce } from "lodash";

import { getPdListByQuery } from "../../store/redux/actions/pdList";
import { useInternet } from "../../store/context/Internet";
import { PdListStyles } from "./styles/PdListStyles";
import { ErrorMessage } from "../../common/constants/ErrorConstants";
import { screens } from "../../common/constants/screen";
import customTheme from "../../common/colors/theme";
import { BottomTabContext } from "../../navigation/mainNavigation";
import ErrorScreen from "../LeadList/component/ErrorScreen";
import PdItem from "./component/PdItem";
import Filter from "./component/Filter";

const pdListData = [{"attributes":{"type":"PD__c","url":"/services/data/v55.0/sobjects/PD__c/a0wC4000000JwrVIAS"},"Id":"a0wC4000000JwrVIAS","Name":"PD-000515","SchDate__c":"2024-04-30","LoanAppl__r":{"attributes":{"type":"LoanAppl__c","url":"/services/data/v55.0/sobjects/LoanAppl__c/a08C40000085RCfIAM"},"Name":"LAN-0781","Status__c":"Soft Approved"},"PdTyp__c":"Physical PD","Appl__c":"a0AC4000000Jf7VMAS","Appl__r":{"attributes":{"type":"Applicant__c","url":"/services/data/v55.0/sobjects/Applicant__c/a0AC4000000Jf7VMAS"},"TabName__c":"ABC","ApplType__c":"P"},"PDStatus__c":"Initiated","IsCompleted__c":false},{"attributes":{"type":"PD__c","url":"/services/data/v55.0/sobjects/PD__c/a0wC4000000Ju3JIAS"},"Id":"a0wC4000000Ju3JIAS","Name":"PD-000514","SchDate__c":"2024-04-29","LoanAppl__r":{"attributes":{"type":"LoanAppl__c","url":"/services/data/v55.0/sobjects/LoanAppl__c/a08C40000083Lt0IAE"},"Name":"LAN-0757","Status__c":"In Progress"},"PdTyp__c":"Physical PD","Appl__c":"a0AC4000000JWp0MAG","Appl__r":{"attributes":{"type":"Applicant__c","url":"/services/data/v55.0/sobjects/Applicant__c/a0AC4000000JWp0MAG"},"TabName__c":"SRIDEVI GUNTUPALLI","ApplType__c":"P"},"PDStatus__c":"In Progress","IsCompleted__c":false},]
export default function PdListScreen({ navigation }) {
  const searchbarRef = useRef(null);
  // const navigation = useNavigation
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [searchQuery, setSearchQuery] = useState("");
  // const [pdListData, setPdListData] = useState([]);
  const [selectedCacheItems, setSelectedCacheItems] = useState([]);
  const [pdTypeFilter, setPdTypeFilter] = useState("All");
  const [pdStatusFilter, setPdStatusFilter] = useState("All");

  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isOnline = useInternet();
  const dispatch = useDispatch();
  const { hasError, pd, loading } = useSelector((state) => state.pd?.pdList);
  // -------------------------------------
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setHideBottomTab(false);
      setSearchQuery("");

      dispatch(getPdListByQuery(isOnline));
    });
    return unsubscribe;
  }, [navigation, isOnline]);
  // -----------------------------------------------
  useEffect(() => {
    const keyboardDismissListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (searchbarRef.current) {
          searchbarRef.current.blur(); // Blur the Searchbar
        }
      }
    );
    return () => {
      keyboardDismissListener.remove();
    };
  }, [searchQuery]);

  // ---------------------------------------
  // useEffect(() => {
  //   const filteredData = pd?.records?.filter((item) => {
  //     const typeFilterCondition =
  //       item?.PdTyp__c === pdTypeFilter || pdTypeFilter === "All";

  //     const statusFilterCondition =
  //       item?.PDStatus__c === pdStatusFilter || pdStatusFilter === "All";

  //     return typeFilterCondition && statusFilterCondition;
  //   });

  //   setPdListData(filteredData);
  //   console.log(JSON.stringify(filteredData),'filteredData')
  //   // alert(JSON.stringify(filteredData))
  // }, [pdTypeFilter, pdStatusFilter]);

  // -----------------------------
  useEffect(() => {
    setHideBottomTab(false);
  }, []);
  // ---------------------------------------
  // useEffect(() => {
  //   setPdListData(pd?.records);
  // }, [pd, isOnline]);
  // ---------------------------------------------------
  useEffect(() => {
    dispatch(getPdListByQuery(isOnline));
  }, [isOnline]);
  // -------------------------------------------------
  function toggleSelection(item) {
    if (selectedCacheItems.includes(item)) {
      setSelectedCacheItems(selectedCacheItems.filter((key) => key !== item));
    } else {
      setSelectedCacheItems([...selectedCacheItems, item]);
    }
  }
  // ------------------------------Search Functionality------------------------
  // const handleSearch = (searchString) => {
  //   const formattedQuery = searchString.toLowerCase();
  //   if (formattedQuery) {
  //     // Filter the data based on the search query
  //     const filteredList = pdListData.filter((item) => {
  //       const itemName = `${item?.Appl__r.TabName__c}`.toLowerCase();
  //       const itemLAN = `${item?.LoanAppl__r.Name}`.toLowerCase();
  //       return (
  //         itemName.includes(formattedQuery) || itemLAN.includes(formattedQuery)
  //       );
  //     });
  //     setSearchQuery(searchString);
  //     setPdListData(filteredList);
  //   } else {
  //     // -------Resetting the List View if Search String is empty---------------
  //     setPdListData(pd?.records);
  //     setSearchQuery(searchString);
  //   }
  // };

  // const debounceSearch = debounce((searchString) => {
  //   handleSearch(searchString);
  // }, 500);
  // -----------------------
  const onChangeSearch = async (searchString) => {
    setSearchQuery(searchString);
    // if (searchString && searchString.length > 1) {
    //   await handleSearch(searchString);
    // }
    if (!searchString) {
      onSearchClearPress();
    }
  };
  // ------------------------------
  const onRefresh = () => {
    setRefreshing(true);
    if (selectedCacheItems.length > 1) {
      setSelectedCacheItems([]);
    }
    if (searchQuery.length < 1) {
      dispatch(getPdListByQuery(isOnline));
    }
    setRefreshing(false);
    setPdStatusFilter("All");
    setPdTypeFilter("All");
  };

  const onSearchClearPress = () => {
    setSearchQuery("");

    setPdListData(pd?.records);
  };

  const handleRenderItem = (Id, IsCompleted, LoanApplStatus) => {
    //    Naviagte to PD Qn/Ans Screen for particular ID
    navigation.navigate(screens?.pd, { Id, IsCompleted, LoanApplStatus });
    setPdTypeFilter("All");
    setPdStatusFilter("All");
    setSelectedCacheItems([]);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedCacheItems.includes(item);
    return (
      <PdItem
        pdData={item}
        toggleSelection={toggleSelection}
        isSelected={isSelected}
        handleRenderItem={handleRenderItem}
      />
    );
  };

  return (
    <View style={PdListStyles.container}>
      {loading && (
        <View style={PdListStyles.loaderView}>
          <ActivityIndicator size="large" color={customTheme.colors.primary} />
        </View>
      )}
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={PdListStyles.searchBar}
        onClearIconPress={onSearchClearPress}
      />

      {!loading && (
        <Filter
          openMenu={openMenu}
          closeMenu={closeMenu}
          visible={visible}
          selectedCacheItems={selectedCacheItems}
          setSelectedCacheItems={setSelectedCacheItems}
          setPdTypeFilter={setPdTypeFilter}
          pdStatusFilter={pdStatusFilter}
          setPdStatusFilter={setPdStatusFilter}
          pdTypeFilter={pdTypeFilter}
          navigation={navigation}
        />
      )}

      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          !loading && <ErrorScreen message={ErrorMessage?.noRecords} />
        }
        data={pdListData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.Id.toString()}
        ItemSeparatorComponent={() => (
          <View style={PdListStyles.itemSeparator} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}
