import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { net, oauth } from 'react-native-force';
import { WebView } from 'react-native-webview';
import { useInternet } from '../../store/context/Internet';
import NavView from './components/NavView';
import { BottomTabContext } from '../../navigation/mainNavigation';
import customTheme from '../../common/colors/theme';

const Loading = () => (
  <ActivityIndicator
    color="blue"
    size="large"
    style={{
      position: 'absolute',
      top: 300,
      left: 200,
    }}
  />
);

const SfWebView = ({ navigation, route }) => {
  const isOnline = useInternet();
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);

  const webViewRef = useRef();
  const [token, setToken] = useState({});
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const [currentUrl, setCurrentUrl] = useState('');
  // const [previousUrl, setPreviousUrl] = useState('');
  // const [visible, setVisible] = useState(false);

  const getUrlByLoanAppl = async (token) => {
    try {
      const loanAppl = route.params?.loanAppl ? route.params?.loanAppl : {};
      console.log('Loan Application', route);
      if (Object.keys(loanAppl).length > 0) {
        console.log(
          'Loan Application Number',
          loanAppl,
          `${token['communityUrl']}/s/loanappl/${loanAppl.Id}/${loanAppl.Name}`
        );
        webViewRef.current.injectJavaScript(`
        window.location.href = ${token['communityUrl']}/s/loanappl/${loanAppl.Id}/${loanAppl.Name};
      `);
        navigation.setParams({ loanAppl: {} });
      }
    } catch (error) {
      console.log('Error getUrlByLoanAppl', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      oauth.getAuthCredentials(
        async (res) => {
          // console.log('Webview Token', res);
          setToken(res);

          await getUrlByLoanAppl(res);
        },
        (err) => {
          console.log('Error getAuthCredentials', err);
        }
      );

      console.log('focus');
      setHideBottomTab(true);
    });
    return unsubscribe;
  }, [navigation, route]);

  const handleReload = () => {
    webViewRef.current.reload();
  };

  const handleBackPress = () => {
    webViewRef.current.goBack();
  };

  const handleForwardPress = () => {
    webViewRef.current.goForward();
  };

  const handleNavStateChange = (navState) => {
    const { url } = navState;

    console.log('Current Url', navState);
    if (!url) return;
    setCanGoBack(true);
    setCanGoForward(true);
    setCurrentUrl(url);
    if (url.includes(`${token['communityUrl']}/s/login`)) {
      net.sendRequest(
        '/services/data',
        `/${net.getApiVersion()}/sobjects/Lead`,
        (res) => {
          // console.log('RES____________________ ');
          oauth.getAuthCredentials(
            (res) => {
              // console.log('Authenicate Res________', res);
              setToken(res);
              const newURL = `${token['communityUrl']}/secur/frontdoor.jsp?sid=${token['accessToken']}&retURL=${token['communityUrl']}`;
              const redirectTo = 'window.location = "' + newURL + '"';
              // console.log('Debugging', redirectTo);
              webViewRef.current.injectJavaScript(redirectTo);
            },
            (err) => {}
          );
        },
        (err) => {
          console.log('ERR_______ :', err);
          //  reject(err);
        },
        'GET'
      );
    }
  };

  useEffect(() => {
    setHideBottomTab(true);
    oauth.getAuthCredentials((res) => {
      // console.log('Webview Token', res);
      setToken(res);
    });
  }, []);

  if (Object.keys(token).length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          ref={webViewRef}
          key={'webview'}
          source={{
            uri: `${token['communityUrl']}/secur/frontdoor.jsp?sid=${token['accessToken']}&retURL=${token['communityUrl']}`,
            // uri: 'https://www.google.com',
          }}
          renderLoading={Loading}
          allowFileAccessFromFileURLs={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          geolocationEnabled={true}
          // javaScriptCanOpenWindowsAutomatically
          onNavigationStateChange={handleNavStateChange}
          allowsBackForwardNavigationGestures
          domStorageEnabled
          // sharedCookiesEnabled={true}
          pullToRefreshEnabled={true}
          bounces={true}
          // cacheEnabled
          // cacheMode="LOAD_CACHE_ELSE_NETWORK"
          originWhitelist={['*']}
          mixedContentMode="always"
          useWebKit
          onRenderProcessGone={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView Crashed: ', nativeEvent.didCrash);
          }}
          useWebView2
        />
        <NavView
          onBackPress={handleBackPress}
          onForwardPress={handleForwardPress}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onReload={handleReload}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }
};

export default SfWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: customTheme.colors.primary,
    opacity: 0.99,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
