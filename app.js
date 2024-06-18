/*
 * Copyright (c) 2017-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "./src/common/components/Loading/SplashScreen";
import { PaperProvider } from "react-native-paper";
import customTheme from "./src/common/colors/theme";
import MainNavigator from "./src/navigation/mainNavigation";
import { Provider as Reduxprovider } from "react-redux";

import store from "./src/store/redux";
import { useEffect } from "react";
import { oauth } from "react-native-force";
import { syncTeamHierarchyData } from "./src/store/soups/MasterDataSoups/TeamHierarchy";
import { syncDSABrJnData } from "./src/store/soups/MasterDataSoups/DsaBrachJunction";
import { RoleProvider } from "./src/store/context/RoleProvider";
import { syncUserInfoData } from "./src/store/soups/MasterDataSoups/UserInfoMaster";
import Toast from "react-native-toast-message";

export const App = function () {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // backgroundSync();
    oauth.getAuthCredentials(
      async (credentials) => {
        // console.log('Credentials', credentials, isOnline);
        // if (isOnline) {

        credentials && (await syncUserInfoData(credentials?.userId));
        credentials && (await syncTeamHierarchyData(credentials?.userId));
        credentials && (await syncDSABrJnData(credentials?.userId));
        // }
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        console.log("Error getting Auth Credentials in Sync Handler ");
      }
    );
  }, []);
  return (
    <PaperProvider theme={customTheme}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#0076C7"
      />
      <NavigationContainer>
        <Reduxprovider store={store}>
          <View style={styles.container}>
            {isLoading ? (
              <SplashScreen />
            ) : (
              <RoleProvider>
                <MainNavigator />
              </RoleProvider>
            )}
          </View>
        </Reduxprovider>
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontWeight: "400",
    backgroundColor: customTheme.colors.background,
  },
});
