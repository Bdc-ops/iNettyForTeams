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

import HeaderView from '../views/HeaderView'

const Stack = createStackNavigator();


class ENT_INT extends React.Component {
  render() {
    const { navigation } = this.props;
    const ENT = navigation.getParam('ENT', null);

  return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
            
            <HeaderView />
          <View style={styles.body}>
                { ENT.id }
          </View>
        </ScrollView>
      </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  scrollView: {
  },
  body: {
    backgroundColor: Colors.white,
  },
});

export default ENT_INT;
