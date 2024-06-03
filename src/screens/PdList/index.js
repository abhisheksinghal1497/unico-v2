import React, { useEffect, useRef, useContext, useState } from "react";

import { FlatList, View, Keyboard } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import { debounce } from "lodash";
import { PdListStyles } from "./styles/PdListStyles";
import { BottomTabContext } from "../../navigation/mainNavigation";
import PdItem from "./component/PdItem";
import Filter from "./component/Filter";
import ErrorScreen from "../LeadList/component/ErrorScreen";
import customTheme from "../../common/colors/theme";
import { screens } from "../../common/constants/screen";
import { ErrorMessage } from "../../common/constants/ErrorConstants";
import { useInternet } from "../../store/context/Internet";
import { getPdListByQuery } from "../../store/redux/actions/pdList";

export default function PdList({ navigation }) {
  const searchbarRef = useRef(null);
  // const navigation = useNavigation

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [pdListData, setPdListData] = useState([]);
  const [pdTypeFilter, setPdTypeFilter] = useState("All");
  const [pdStatusFilter, setPdStatusFilter] = useState("All");

  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isOnline = useInternet();
  const dispatch = useDispatch();
  console.log("pdStatusFilter", pdStatusFilter);
  const { hasError, pd, loading } = useSelector((state) => state.pd?.pdList);
  console.log("PdList--->", pd);
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
  useEffect(() => {
    const filteredData = pd?.records?.filter((item) => {
      console.log("item in useEffect", item);
      const typeFilterCondition =
        item?.PdTyp__c === pdTypeFilter || pdTypeFilter === "All";

      const statusFilterCondition =
        item?.PDStatus__c === pdStatusFilter || pdStatusFilter === "All";

      return typeFilterCondition && statusFilterCondition;
    });

    setPdListData(filteredData);
  }, [pdTypeFilter, pdStatusFilter]);

  // -----------------------------
  useEffect(() => {
    setHideBottomTab(false);
  }, []);
  // ---------------------------------------
  useEffect(() => {
    setPdListData(pd?.records);
  }, [pd, isOnline]);
  // ---------------------------------------------------
  useEffect(() => {
    dispatch(getPdListByQuery(isOnline));
  }, [isOnline]);
  // -------------------------------------------------

  // ------------------------------Search Functionality------------------------
  const handleSearch = (searchString) => {
    console.log("searchString", searchString);
    const formattedQuery = searchString.toLowerCase();
    console.log("pdListData", pdListData);
    if (formattedQuery) {
      // Filter the data based on the search query
      const filteredList = pdListData.filter((item) => {
        const itemName = `${item?.Appl__r.TabName__c}`.toLowerCase();
        const itemLAN = `${item?.LoanAppl__r.Name}`.toLowerCase();
        return (
          itemName.includes(formattedQuery) || itemLAN.includes(formattedQuery)
        );
      });
      console.log("itemName", filteredList);
      setSearchQuery(searchString);
      setPdListData(filteredList);
    } else {
      // -------Resetting the List View if Search String is empty---------------
      setPdListData(pd?.records);
      setSearchQuery(searchString);
    }
  };

  const debounceSearch = debounce((searchString) => {
    handleSearch(searchString);
  }, 500);
  // -----------------------
  const onChangeSearch = async (searchString) => {
    setSearchQuery(searchString);
    if (searchString && searchString.length > 1) {
      await handleSearch(searchString);
    }
    if (!searchString) {
      onSearchClearPress();
    }
  };
  // ------------------------------
  const onRefresh = () => {
    setRefreshing(true);

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
  };

  const renderItem = ({ item }) => {
    return <PdItem pdData={item} handleRenderItem={handleRenderItem} />;
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
          setPdTypeFilter={setPdTypeFilter}
          pdStatusFilter={pdStatusFilter}
          setPdStatusFilter={setPdStatusFilter}
          pdTypeFilter={pdTypeFilter}
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
