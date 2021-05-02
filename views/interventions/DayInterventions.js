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
  Image,
  TouchableOpacity,
  SectionList,

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
import FooterView from '../static_component/FooterView'
import LinearGradient from 'react-native-linear-gradient';

// import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();


const DATA = [
  {
    id: 123456789,
    heure_debut: '09h',
    heure_fin: '17h',
    adresse: '6 rue Thier, 92600 Asnières-sur-Seine',
  },
];



class DayInterventions extends React.Component {

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>

        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('Dashboard')} >
            <Image style={{ width: 60, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.TextStyle}>{'\n'}Vous avez (5) Missions pour aujourd'hui</Text>

        <View style={styles.body}>

          {DATA.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('fiche_intervention', { ENT: item })}>
              <View style={styles.intContainer}>
                <View>
                  <Text style={{ color: "#ffffff", position: 'absolute', right: 0, backgroundColor: '#224D88', padding: 5, borderRadius: 10 }}>int_{item.id}</Text>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                  <Image
                    style={{ width: 25, height: 25, marginRight: 5 }}
                    source={require('../../resources/images/clock.png')}
                  />
                  <Text>9h - 17h</Text>
                </View>

                <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', }}>
                  <Image
                    style={{ width: 25, height: 25, marginRight: 5 }}
                    source={require('../../resources/images/placeholder.png')}
                  />
                  <Text>6 rue Thier, 92600 Asnières-sur-Seine</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}



        </View>





        <FooterView />
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: "#0099CC",
    height: 50,
    borderRadius: 10,
    margin: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',

  },
  TextStyle: {
    color: '#000000',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  intContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0, height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15
  },


});

export default DayInterventions;
