/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import Devices from './src/screens/devices';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaView style={{}}>
      <StatusBar
        backgroundColor={isDarkMode ? '#2f2f2f' : 'white'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Devices />
    </SafeAreaView>
  );
};

export default App;
