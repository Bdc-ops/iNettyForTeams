import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const waiting = require('../../resources/images/waiting.png');
const buildings = require('../../resources/images/buildings.png');

class list_logements extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      day: '',
      id_entervention: '',
      ref_intervention: '',
      indicator: '',
      id_addresse: '',
      list_logements: [],
      timer: 1,
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 1 });
    AsyncStorage.getItem('user_token')
      .then(token => {
        if (token) {
          const id_entervention = this.props.navigation.getParam('id_entervention', null);
          const ref_intervention = this.props.navigation.getParam('ref_intervention', null);
          const indicator = this.props.navigation.getParam('indicator', null);
          const id_addresse = this.props.navigation.getParam('id_addresse', null);
          const day = this.props.navigation.getParam('day', null);
          this.setState({
            day: day,
            id_entervention: id_entervention,
            ref_intervention: ref_intervention,
            indicator: indicator,
            id_addresse: id_addresse,
          });
          console.log('inter :' + id_entervention);

          this.Get_details_logements(token, id_entervention, id_addresse);

        } else {
          //navigate('error');
        }
      });
  }

  componentWillUnmount() {
    this.handler.remove()
    BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }


  async Get_details_logements(token, id_entervention, id_addresse) {
    console.log('de l\'intervention' + id_entervention);

    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/${id_entervention}/logements`, { auth_token: `${token}` })
      .then(async (response) => {
        console.log('==============================');
        console.log('Liste des logements');
        console.log('Reponse API status : ' + response.status);
        if (response.data.success == true) {
          console.log('msg success' + response.data.success);
          console.log('List correctly mapped');
          let list_logements = response.data.logements;
          var data = [];
          await Object.keys(list_logements, id_entervention, id_addresse).forEach(async function (index) {
            if (list_logements[index].adresse_id === id_addresse) {
              data.push(list_logements[index]);
            }
          });
          this.setState({ list_logements: data, timer: 0 });



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
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('fiche_intervention', { id_entervention: this.state.id_entervention, indicator: 'interventions', day: '' })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Logements</Text>
          <Text style={{ color: "#ffffff", backgroundColor: '#224D88', padding: 5, borderRadius: 10, borderStyle: 'solid', position: 'absolute', right: 10, fontSize: 15, fontWeight: 'bold' }}>{this.state.ref_intervention ? this.state.ref_intervention : '---'}</Text>
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


          {this.state.list_logements.length > 0 ?
            this.state.list_logements.map((detail, index) =>
              this.state.list_logements[index].status == "refus" ?

                (
                  <TouchableOpacity key={index}>
                    <View style={styles.intContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                        <Text style={{ fontSize: 20, color: "grey", width: 210 }} numberOfLines={1}>Etage {this.state.list_logements[index].etage_num} - Appt {this.state.list_logements[index].appart_num}</Text>
                        <Text style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: '#eb4d4b', padding: 5, borderRadius: 10 }}>Refusé</Text>

                      </View>
                    </View>
                  </TouchableOpacity>
                )
                :
                this.state.list_logements[index].status == "pending" ?
                  (
                    <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('list_passages', { id_logement: this.state.list_logements[index].id, id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.list_logements[index].appart_num })}>
                      <View style={styles.intContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                          <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', width: 210 }} numberOfLines={1}>Etage {this.state.list_logements[index].etage_num} - Appt {this.state.list_logements[index].appart_num}</Text>
                          <Text style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: '#f0932b', padding: 5, borderRadius: 10 }}>À faire</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                  :
                  this.state.list_logements[index].status == "fait" ?
                    (
                      <TouchableOpacity key={index}>
                        <View style={styles.intContainer}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                            <Text style={{ fontSize: 20, color: "grey", width: 210 }} numberOfLines={1}>Etage {this.state.list_logements[index].etage_num} - Appt {this.state.list_logements[index].appart_num}</Text>
                            <Text style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: '#6ab04c', padding: 5, borderRadius: 10 }}>Fait</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                    :
                    (<Text></Text>)



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
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
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
    marginBottom: 20,
    marginTop: 20,
  },
  img_building: {
    width: 270,
    height: 190,
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
    borderRadius: 20,
    padding: 15
  },
  buildingsContainer: {
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
    padding: 15,
    marginBottom: 50,
  }


});


export default list_logements;
