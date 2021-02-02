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

import HeaderView from '../views/HeaderView'
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
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          
          <HeaderView />
          <View style={styles.body}>
            <Text style={{fontSize: 20, color: "#224D88", fontWeight: 'bold'}}>Missions du jour</Text>
          </View>

            { DATA.map( (item, index) =>  ( 
                <View key={index}>

                <TouchableOpacity
                    onPress={() =>  this.props.navigation.navigate('ENT_INT', { ENT: item }) }
                >
                    <View style={styles.intContainer}>
                        <View>
                            <Text style={{color: "#959595"}}>#int_{item.id}</Text>
                        </View>
                        <View style={{marginTop: 10, alignItems: 'center', flexDirection: 'row',}}>
                            <Image
                                style={{width: 25, height: 25, marginRight: 5}}
                                source={require('../resources/images/clock.png')}
                            />
                            <Text>9h - 17h</Text>
                        </View>

                        <View style={{marginTop: 10, alignItems: 'center', flexDirection: 'row',}}>
                            <Image
                                style={{width: 25, height: 25, marginRight: 5}}
                                source={require('../resources/images/placeholder.png')}
                            />
                            <Text>6 rue Thier, 92600 Asnières-sur-Seine</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                </View>
            ) ) }
            
            



            {/**
             * the end of today's missions
             */}

             <View style={{marginTop: 25, alignItems: 'center', marginBottom: 12}}>
                 <Image style={{width: 120, height: 120, opacity: 0.5, marginBottom: 10}}
                    source={require('../resources/images/handwash.png')}
                 />
                 <Text style={{color: "#959595"}}>C'est tout, pour aujourd'hui!</Text>
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
    flexDirection: 'column',
    flex: 9,
    padding: 15
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
  }

});

export default DayInterventions;
