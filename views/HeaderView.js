


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();


class HeaderView extends React.Component {
  render() {
  return (
    <View style={styles.header}>         
    </View>
  );
  }
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#0099CC",
        height: 50,
        flex: 1
    },
});

export default HeaderView;
