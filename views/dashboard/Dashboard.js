import React from 'react';
import { StyleSheet, ScrollView, View, Text, Alert, TouchableOpacity, Image, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import AsyncStorage from '@react-native-community/async-storage';
const disconnect = require('../../resources/images/disconnect.png');
import axios from 'axios';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            today_date: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '-' + ((new Date().getDate()) > 10 ? (new Date().getDate()) : '0' + (new Date().getDate())),
            count_interventions: '---'
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
                    this.setState({ count_interventions: data.length });
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
        console.log(navigation)
        return (
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>

                <View style={{ flexDirection: 'column' }}>

                    <View style={styles.body}>
                        <View style={{ flex: 1, }}>

                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#BCD0EB', '#BCD0EB', '#ffffff', '#ffffff']} style={styles.container}>
                                <TouchableOpacity style={{ alignItems: 'flex-end', position: 'absolute', right: 10, top: 10, width: 30, height: 30 }} onPress={() => {
                                    this._logout()
                                }}>
                                    <Image style={{ width: 30, height: 30 }} source={disconnect}></Image>
                                </TouchableOpacity>

                                <View style={{
                                    alignContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('List_plannings', { plannings_day: this.state.today_date, indicator: 'dashboard' })
                                        }}
                                    >
                                        <Text style={{
                                            backgroundColor: "#224D88", color: "#fff", padding: 30, fontSize: 30,
                                            borderTopLeftRadius: 100, borderBottomLeftRadius: 100, borderTopRightRadius: 100
                                        }}>
                                            {this.state.count_interventions || this.state.count_interventions >= 0 ? this.state.count_interventions : '---'}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{
                                        color: '#224D88'
                                    }}>
                                        Interventions du jour
                                </Text>
                                </View>

                            </LinearGradient>

                        </View>




                        <View style={{ flex: 1 }}>
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
                                        <Image source={require("../../resources/images/planning.png")}
                                            style={{ width: 210, height: 200 }}
                                        />
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
                                    <View>
                                        <Text style={{
                                            fontSize: 15,
                                            color: "#224D88",
                                            fontWeight: 'bold'

                                        }}>Toutes les interventions</Text>
                                    </View>
                                    <View style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 25
                                    }}>
                                        <Image source={require("../../resources/images/intervention.png")}
                                            style={{ width: 210, height: 200 }}
                                        />
                                    </View>
                                </TouchableOpacity>

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
                                            this.props.navigation.navigate('Configurations')
                                        }}>

                                        <View>
                                            <Text style={{
                                                fontSize: 15,
                                                color: "#224D88",
                                                fontWeight: 'bold'

                                            }}>Configurations</Text>
                                        </View>
                                        <View style={{
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 25,
                                        }}>
                                            <Image source={require("../../resources/images/configuration.png")}
                                                style={{ width: 230, height: 200 }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>

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
        padding: 15,
        margin: 10,
        borderRadius: 25
    }
});

export default Home;
