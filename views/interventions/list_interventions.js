import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import FooterView from '../static_component/FooterView'
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const waiting = require('../../resources/images/waiting.png');
const nothing = require('../../resources/images/nothing.png');

class list_interventions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list_interventions: [],
      timer: 1,
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 1 });
    AsyncStorage.getItem('user_token')
      .then(token => {
        const { navigate } = this.props.navigation;
        if (token) {
          this.Get_list_interventions(token);
        } else {
          //navigate('error');
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
        console.log('Liste des interventions');
        console.log('Reponse API status : ' + response.status);
        if (response.data.success == true) {
          console.log('List correctly mapped');
          let list_intervention = response.data.ents_list;
          var data = [];
          await Object.keys(list_intervention).forEach(async function (index) {
            data.push(list_intervention[index]);
          });
          this.setState({ list_interventions: data, timer: 0 });
        }
        console.log('==============================');
      })
      .catch(async (error) => {
        console.log("ERROR API interventions liste URL : " + error);
        console.log('==============================');
      });
  }


  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>

        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('Dashboard')} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Interventions hebdomadaires</Text>

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


          {this.state.list_interventions.length > 0 ?
            this.state.list_interventions.map((detail, index) => (
              <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('fiche_intervention', { id_entervention: detail.id, indicator: 'interventions', day: '' })}>
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
                    <Text>{detail.date_du ? detail.date_du : '- - - -'} - {detail.date_au ? detail.date_au : '- - - -'}</Text>
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
            :
            this.state.list_interventions.length == 0 && this.state.timer == 0 ?
              (
                <View style={styles.loading_view}>
                  <Image style={styles.img} source={nothing} />
                  <Text style={styles.error_text}>Aucune intervention pour cette semaine</Text>
                </View>
              )
              :
              (<Text></Text>)
          }



        </View>





        <FooterView />
      </ScrollView >
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
  error_text: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'red',
  },
  TextStyle: {
    color: '#000000',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    color: '#224D88',
  },
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    marginBottom: 50
  },
  loading_text: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00BFA6',
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
    marginTop: 50,
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
    borderRadius: 20,
    padding: 15
  },


});

export default list_interventions;
