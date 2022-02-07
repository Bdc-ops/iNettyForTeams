import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const waiting = require('../../resources/images/waiting.png');
const nothing = require('../../resources/images/nothing.png');
import moment from 'moment';
class List_plannings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_plannings: [],
            timer: 1,
            plannings_day: '',
            indicator: ''
        };
    }

    componentDidMount() {
        this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
        this.setState({ timer: 1 });
        AsyncStorage.getItem('user_token')
            .then(token => {
                if (token) {
                    const plannings_day = this.props.navigation.getParam('plannings_day', null);
                    const indicator = this.props.navigation.getParam('indicator', null);

                    this.setState({ plannings_day: plannings_day, indicator: indicator });
                    this.Get_list_plannings(token, plannings_day);
                } else {
                    //navigate('error');
                }
            });
    }

    componentWillUnmount() {
        this.handler.remove()
        BackHandler.addEventListener('hardwareBackPress', () => { return false })
    }



    async Get_list_plannings(token, plannings_day) {
        await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/weekly/list`, { auth_token: `${token}` })
            .then(async (response) => {
                console.log('==============================');
                console.log('Liste des interventions');
                console.log('Reponse API status : ' + response.status);
                if (response.data.success == true) {
                    console.log('List correctly mapped');
                    let planning = response.data.ents_list;
                    var data = [];
                    await Object.keys(planning, plannings_day).forEach(async function (index) {
                        if (planning[index].date_du === plannings_day) {
                            data.push(planning[index]);
                            console.log('find plannigs for : ' + planning[index].date_du);
                        } else {
                            console.log('no planning for this day : ' + plannings_day)
                        }

                    });
                    this.setState({ list_plannings: data, timer: 0 });


                }
                console.log('==============================');
            })
            .catch(async (error) => {
                console.log("ERROR API interventions for planning liste URL : " + error);
                console.log('==============================');
            });
    }


    render() {
        return (
            <ScrollView contentContainerStyle={styles.scrollView}>

                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
                    <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.state.indicator == 'planning' ? this.props.navigation.navigate('Planning') : this.props.navigation.navigate('Dashboard')} >
                        <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
                    </TouchableOpacity>
                    <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Interventions du {moment(this.state.plannings_day).format("DD-MM-YYYY")}</Text>

                </LinearGradient>

                <View style={styles.body}>


                    {
                        this.state.timer === 1 ?
                            (<View style={styles.loading_view}>
                                <Image style={styles.img} source={waiting} />
                                <Text style={styles.loading_text}>Chargement en cours ...</Text>
                            </View>
                            )
                            :
                            (<Text></Text>)

                    }

                    {
                        /*                this.state.list_plannings.length <= 0 ?
                                            (<View style={styles.loading_view}>
                                                <Image style={styles.img} source={waiting} />
                                                <Text style={styles.loading_text}>Chargement en cours ...</Text>
                                            </View>
                                            )
                                            :
                                            (<Text>Aucune intervention pour le {this.state.plannings_day}</Text>)
                */
                    }





                    {this.state.list_plannings.length > 0 ?
                        this.state.list_plannings.map((detail, index) => (
                            <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('fiche_intervention', { id_entervention: detail.id, indicator: 'plannings', day: this.state.plannings_day })}>
                                <View style={styles.intContainer}>
                                    <View>
                                        <Text style={{ color: '#224D88', fontSize: 20, marginBottom: 5, width: 200 }} numberOfLines={1}>{detail.nom_client ? detail.nom_client : '- - - -'}</Text>
                                        <Text style={{ color: "#ffffff", position: 'absolute', right: 0, backgroundColor: '#224D88', padding: 5, borderRadius: 10 }}>{detail.ref_devis}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                        <Image
                                            style={{ width: 25, height: 25, marginRight: 5 }}
                                            source={require('../../resources/images/clock.png')}
                                        />
                                        <Text>{detail.date_du ? moment(detail.date_du).format("DD-MM-YYYY") : '- - - -'} - {detail.date_au ? moment(detail.date_au).format("DD-MM-YYYY") : '- - - -'}</Text>
                                    </View>
                                    <Text style={{ marginLeft: 30 }}>Heure d'arrivée : {detail.heure_arrive ? detail.heure_arrive : '- - - -'}</Text>

                                    <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', }}>
                                        <Image
                                            style={{ width: 25, height: 25, marginRight: 5 }}
                                            source={require('../../resources/images/placeholder.png')}
                                        />
                                        <Text>Lieu : {detail.lieu_execution ? detail.lieu_execution : '- - - -'}</Text>
                                    </View>
                                    <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', }}>
                                        <Image
                                            style={{ width: 25, height: 25, marginRight: 5 }}
                                            source={require('../../resources/images/contact.png')}
                                        />
                                        <Text>Contact : {detail.nom_contact ? detail.nom_contact : '- - - -'}</Text>
                                    </View>
                                    {
                                        detail.statut == "terminée" ?
                                            (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: '#6ab04c', padding: 5, borderRadius: 10 }}>{detail.statut}</Text>)
                                            : detail.statut == "brouillon" ?
                                                (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: 'blue', padding: 5, borderRadius: 10 }}>{detail.statut}</Text>)
                                                : detail.statut == "affectée" ?
                                                    (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: '#f0932b', padding: 5, borderRadius: 10 }}>{detail.statut}</Text>)
                                                    : (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: 'gray', padding: 5, borderRadius: 10 }}>-----</Text>)

                                    }




                                </View>
                            </TouchableOpacity>
                        ))
                        : this.state.list_plannings.length == 0 && this.state.timer == 0 ?
                            (
                                <View style={styles.loading_view}>
                                    <Image style={styles.img} source={nothing} />
                                    <Text style={styles.error_text}>Aucune intervention pour le {this.state.plannings_day}</Text>
                                </View>
                            )
                            :
                            (<Text></Text>)
                    }



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
        borderRadius: 30,
        margin: 10,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',

    },
    body: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        marginBottom: 50,
    },
    loading_text: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00BFA6',
    },
    error_text: {
        alignItems: 'center',
        justifyContent: 'center',
        color: 'red',
    },
    info_text: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#224D88',
        margin: 10,
        textAlign: 'center',
    },
    loading_view: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        width: 350,
        height: 240,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20,
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


export default List_plannings;
