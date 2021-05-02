


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
import { version } from '../../package.json';
import LinearGradient from 'react-native-linear-gradient';


const Stack = createStackNavigator();


class FooterView extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.rad}></View>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#224D88', '#224D88', '#224D88']} style={styles.footer}>
          <Text style={styles.TextStyle}>{'\n'}iNetty Team v {version} © Tous droits réservés - BDC</Text>
        </LinearGradient>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  TextStyle: {
    marginTop: 10,
    color: '#fff',
    textAlign: 'center',
  },
  rad: {
    width: '100%',
    height: 80,
    backgroundColor: '#ffffff',
    bottom: 0,
    marginBottom: 45,
    position: 'absolute',
    zIndex: 5,
    borderRadius: 80,
  },
});

export default FooterView;
