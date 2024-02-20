import React, { useState, useEffect, createContext, useContext } from 'react';
import Netinfo from '@react-native-community/netinfo';

export const InternetContext = createContext({ isOnline: false });

export const InternetProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);

  Netinfo.configure({
    reachabilityUrl: 'https://mail.google.com/',
    reachabilityTest: async (response) => response.status === 200,
    reachabilityLongTimeout: 30 * 1000, // 30sec
    reachabilityShortTimeout: 5 * 1000, // 5sec
    reachabilityRequestTimeout: 15 * 1000, // 15sec
  });

  useEffect(() => {
    Netinfo.fetch().then((state) => {
      if (isOnline !== state.isConnected) {
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      }
    });
  }, []);

  Netinfo.addEventListener((state) => {
    // console.log("State****", state);
    if (isOnline !== state.isConnected) {
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    }
  });

  return (
    <InternetContext.Provider value={{ isOnline: isOnline }}>
      {children}
    </InternetContext.Provider>
  );
};

export const useInternet = () => {
  const { isOnline } = useContext(InternetContext);
  return isOnline;
};
