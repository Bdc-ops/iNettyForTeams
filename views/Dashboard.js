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
  Dimensions, TouchableHighlight,
  TouchableOpacity,
  Image,
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

import DayInterventions from '../views/DayInterventions'
import Login from '../views/Login'
import HeaderView from './HeaderView'

const Stack = createStackNavigator();


class Home extends React.Component {
    
  render() {
    const { navigation } = this.props;
    console.log(navigation)
  return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          
          <View style={{flexDirection: 'column'}}>
            <HeaderView />

            <View style={styles.body}>
                <View style={{ flex: 1, }}>
                    <View style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0, height: 2
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 10,
                        elevation: 3,
                        padding: 15,
                        margin: 10,
                        backgroundColor: "#fff",

                    }}>
                        <View>
                            <Text style={{
                                fontSize: 20,
                                color: "#224D88",
                                fontWeight: 'bold'

                            }}>Missions du jour</Text>
                        </View>
                        
                            <View style={{
                                alignContent: 'center',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('DayInterventions')
                                    }}
                                >
                                    <Text style={{backgroundColor: "#224D88", color: "#fff", padding: 30, fontSize: 30,
                                    borderTopLeftRadius: 100, borderBottomLeftRadius: 100, borderTopRightRadius: 100}}>
                                        2
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{
                                    color: '#224D88'
                                }}>
                                    Interventions
                                </Text>
                            </View>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{
                        flex: 1,
                    }}>
                        <View style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0, height: 2
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 10,
                        elevation: 3,
                        padding: 15,
                        margin: 10,
                        backgroundColor: "#fff",

                    }}>
                        <View>
                            <Text style={{
                                fontSize: 15,
                                color: "#224D88",
                                fontWeight: 'bold'

                            }}>Planning</Text>
                        </View>
                        <View style={{
                            alignContent: 'center',
                            alignItems: 'center',
                            marginTop: 25,
                        }}>
                            <Image source={require("../resources/images/appointment.png")}
                                style={{width: 100, height: 100}}
                            />
                        </View>
                    </View>
                    </View>

                    <View style={{
                        flex: 1,
                    }}>
                        <View style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0, height: 2
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 10,
                        elevation: 3,
                        padding: 15,
                        margin: 10,
                        backgroundColor: "#fff",

                    }}>
                        <View>
                            <Text style={{
                                fontSize: 15,
                                color: "#224D88",
                                fontWeight: 'bold'

                            }}>Toutes les interventions (91)</Text>
                        </View>
                        <View style={{
                            alignContent: 'center',
                            alignItems: 'center',
                            marginTop: 25
                        }}>
                            <Image source={require("../resources/images/household.png")}
                                style={{width: 100, height: 100}}
                            />
                        </View>
                    </View>
                    </View>

                </View>
            </View>
        </View>
        </ScrollView>
      </SafeAreaView>
  );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  
  body: {
      flexDirection: 'column',
      flex: 9,
  }
});

export default Home;
