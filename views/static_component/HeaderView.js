


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
import LinearGradient from 'react-native-linear-gradient';


const Stack = createStackNavigator();


class HeaderView extends React.Component {
  render() {
  return (
    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB','#BCD0EB', '#ffffff', '#ffffff']} style={styles.header}>
  </LinearGradient>
  );
  }
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#0099CC",
        height: 50,
        borderRadius:10,
        margin:10

      },
});

export default HeaderView;
