import React,{useRef, useCallback, useState} from 'react';
import { StyleSheet, ScrollView, View, Text, Alert, TouchableOpacity, Image, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
const disconnect = require('../../resources/images/disconnect.png');
const config = require('../../resources/images/config.png');

import { AnimatedCircularProgress } from 'react-native-circular-progress';

const IMG1 = require('../../resources/images/bg_home.png');
class Home extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            today_date: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '-' + ((new Date().getDate()) >= 10 ? (new Date().getDate()) : '0' + (new Date().getDate())),
            count_interventions: '---',
            progress:50
        };
    }
    componentDidMount() {
        this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
        AsyncStorage.getItem('user_token')
            .then(token => {
                const { navigate } = this.props.navigation;
                if (token) {
                    this.Get_list_interventions(token);
                } else {
                }
            });
    }
    componentWillUnmount() {
        this.handler.remove()
        BackHandler.addEventListener('hardwareBackPress', () => { return false })
    }


    async Get_list_interventions(token) {
        await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/weekly/list`, { auth_token: `${token}` })
            .then(async (response) => {
                console.log('==============================');
                console.log('Get count of interventions');
                console.log('today date :' + this.state.today_date);
                console.log('Reponse API status : ' + response.status);
                if (response.data.success == true) {
                    let list_intervention = response.data.ents_list;
                    var data = [];
                    var date = this.state.today_date;
                    await Object.keys(list_intervention, date).forEach(async function (index) {
                        console.log('date du : ' + list_intervention[index].date_du + '- today :' + date)
                        if (list_intervention[index].date_du === date) {
                            data.push(list_intervention[index]);
                        }
                    });
                    this.setState({ count_interventions: data.length,progress:100 });
                    console.log('Count intervention du jour : ' + data.length);
                }
                console.log('==============================');
            })
            .catch(async (error) => {
                console.log("ERROR API interventions liste URL : " + error);
                console.log('==============================');
            });
    }


    _logout() {
        console.log('logout');
        Alert.alert(
            "IMPORTANT",
            "Voulez-vous vraiment se déconnecter de l'application .",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Confirmer", onPress: () => this._logout_action()
                }
            ],
            { cancelable: false }
        );
    }

    _logout_action() {
        AsyncStorage.removeItem('user_token')
            .then(result => {
                AsyncStorage.removeItem('username')
                    .then(result => {
                        BackHandler.exitApp();
                    });
            });


    }

    render() {
        const { navigation } = this.props;


        return (
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>

                <View style={{ flexDirection: 'column' }}>

                    <View style={styles.body}>
                        <View style={{ flex: 1, }}>

                            <View style={styles.container}>
                            <Image source={IMG1} style={styles.image}></Image>

                                <TouchableOpacity style={{ alignItems: 'flex-end', position: 'absolute', right: 10, top: 10, width: 30, height: 30 }} onPress={() => {this._logout()}}>
                                    <Image style={{ width: 30, height: 30 }} source={disconnect}></Image>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ alignItems: 'flex-end', position: 'absolute', left: 10, top: 10, width: 30, height: 30 }} onPress={() => {this.props.navigation.navigate('Configurations')}}>
                                    <Image style={{ width: 30, height: 30 }} source={config}></Image>
                                </TouchableOpacity>


                                <TouchableOpacity style={{alignContent: 'center',alignItems: 'center',position: 'absolute',top:'20%'}}
                                onPress={() => {this.props.navigation.navigate('List_plannings', { plannings_day: this.state.today_date, indicator: 'dashboard' })}}>
                                    <AnimatedCircularProgress
                                        size={190}
                                        width={20}
                                        fill={this.state.progress}
                                        tintColor="#ffffff"
                                        onAnimationComplete={() => console.log('onAnimationComplete')}
                                        backgroundColor="#BCD0EB">
                                            {(fill) => (
                                            <View style={{alignContent: 'center',alignItems: 'center'}}>
                                                <Text style={{color: "#ffffff", fontSize: 50}}>
                                                {this.state.count_interventions || this.state.count_interventions >= 0 ? this.state.count_interventions : '---'}
                                                </Text>
                                                <Text style={{color: '#ffffff', fontSize: 12}}>Interventions du jour</Text>
                                            </View>
                                                )}
                                    </AnimatedCircularProgress>
                                    

                                </TouchableOpacity>
                            </View>
                            {/*<View style={styles.rad}></View> */}
                        </View>




                        <View style={{ flex: 1,flexDirection: 'row'}}>
                            <View style={{
                                flex: 1
                            }}>
                                <TouchableOpacity style={{
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
                                    borderRadius: 25

                                }}
                                    onPress={() => {
                                        this.props.navigation.navigate('Planning')
                                    }}>

                                


                                    
                                    <View style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Image source={require("../../resources/images/planning.png")}
                                            style={{ width: 150, height: 120 }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            fontSize: 15,
                                            color: "#224D88",
                                            fontWeight: 'bold', textAlign: 'center'
                                        }}>Calendrier</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flex: 1,
                            }}>
                                <TouchableOpacity style={{
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
                                    borderRadius: 25

                                }}
                                    onPress={() => {
                                        this.props.navigation.navigate('list_interventions')
                                    }}>
                                    <View style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Image source={require("../../resources/images/intervention.png")}
                                            style={{ width: 150, height: 120 }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            fontSize: 15,
                                            color: "#224D88",
                                            fontWeight: 'bold', textAlign: 'center'

                                        }}>Interventions</Text>
                                    </View>
                                </TouchableOpacity>

                               

                            </View>

                        </View>
                    </View>
                </View>

                <FooterView />
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#ffffff',
    },

    body: {
        flexDirection: 'column',
        flex: 9,
    },
    image: {
        flex: 1,
        width: '100%',
        opacity:1
    },
    decore_right: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40%',
        height: '50%',
        borderTopRightRadius: 25
    },
    decore_left: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40%',
        height: '50%',
        borderTopLeftRadius: 25
    },
    container: {
        width: '100%',
        height: 450,
        alignItems: 'center',
        justifyContent: 'center',
        //height:320
        //margin: 10,
    },
    rad: {
        width: '100%',
        height: 80,
        backgroundColor: '#ffffff',
        bottom: 0,
        marginBottom: -40,
        position: 'absolute',
        zIndex: 5,
        borderRadius: 80,
      },
});

export default Home;
