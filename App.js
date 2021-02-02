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
import { createAppContainer, createSwitchNavigator, } from 'react-navigation';


/**
 * importing views
 */
import Home from './views/Home';
import Dashboard from './views/Dashboard'
import Login from './views/Login'
import DayInterventions from './views/DayInterventions';
import ENT_INT from './views/ENT_INT'


global.connected = true


const Stack = createStackNavigator();


export default class App extends React.Component {
  render() {

    const Navigation = createAppContainer(createSwitchNavigator(
      {
        Splash: Home,
        Login: Login,
        Dashboard: Dashboard,
        DayInterventions: DayInterventions,
        ENT_INT: ENT_INT,
      },
      {
        initialRouteName: 'Splash',
      }
    ));



    return <Navigation />;
  }

}