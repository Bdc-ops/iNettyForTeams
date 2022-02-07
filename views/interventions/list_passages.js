import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, Alert, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const waiting = require('../../resources/images/waiting.png');
const buildings = require('../../resources/images/buildings.png');

class list_passages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      day: '',
      id_logement: '',
      indicator: '',
      id_entervention: '',
      ref_intervention: '',
      id_addresse: '',
      list_passages: [],
      timer: 1,
      message: '',
      Appt: '',
      batiment_name:''
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 1 });
    AsyncStorage.getItem('user_token')
      .then(token => {
        if (token) {
          const id_entervention = this.props.navigation.getParam('id_entervention', null);
          const id_logement = this.props.navigation.getParam('id_logement', null);
          const indicator = this.props.navigation.getParam('indicator', null);
          const ref_intervention = this.props.navigation.getParam('ref_intervention', null);
          const id_addresse = this.props.navigation.getParam('id_addresse', null);
          const Appt = this.props.navigation.getParam('appt', null);
          const batiment_name = this.props.navigation.getParam('batiment_name', null);
          

          const day = this.props.navigation.getParam('day', null);
          this.setState({
            day: day,
            id_logement: id_logement,
            indicator: indicator,
            id_entervention: id_entervention,
            id_addresse: id_addresse,
            ref_intervention: ref_intervention,
            batiment_name:batiment_name,
            token: token,
            Appt: Appt,
          });
          console.log('Liste passage - Num appart passage : ', Appt);
          console.log('inter :' + id_entervention + '- log :' + id_logement);
          this.Get_details_passages(token, id_logement);

        } else {
          //navigate('error');
        }
      });
  }

  componentWillUnmount() {
    this.handler.remove()
    BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }

  async Get_details_passages(token, id_logement) {
    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/weekly/list/logement/${id_logement}/passages`, { auth_token: `${token}` })
      .then(async (response) => {
        console.log('==============================');
        console.log('Liste des passage');
        console.log('du logement' + id_logement);
        console.log('Reponse API status : ' + response.status);
        if (response.data.length > 0) {
          console.log('msg success' + response.data.success);
          console.log('List correctly mapped');
          let list_passages = response.data;
          var data = [];
          await Object.keys(list_passages, id_logement).forEach(async function (index) {
            console.log('id logement' + id_logement);
            data.push(list_passages[index]);
            console.log(list_passages[index]);
          });
          this.setState({ list_passages: data, timer: 0 });
        }
        console.log('==============================');
      })
      .catch(async (error) => {
        console.log("ERROR API interventions liste URL : " + error);
        console.log('==============================');
      });
      console.log('name : '+this.state.batiment_name);
  }

  refuse_btn() {
    Alert.alert(
      "IMPORTANT",
      "Voulez-vous vraiment refuser tous les passages du logement : Logement " + this.state.id_logement,
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Confirmer", onPress: () => this._refus_action()
        }
      ],
      { cancelable: false }
    );
  }

  async _refus_action() {
    console.log('==============================');
    console.log('Token : ' + this.state.token);
    console.log('ID logement : ' + this.state.id_logement);
    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/logement/refused`, { auth_token: `${this.state.token}`, int2_id: this.state.id_logement })
      .then(async (response) => {
        if (response.status == 200) {
          console.log('Refuser les passages du logement : ' + this.state.id_logement);
          console.log('Reponse API status : ' + response.status);
          this.setState({ message: 'Opération réussie, les passages du logement sont attribués comme refusé.' })
          console.log('==============================');
          //this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention });
          this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, id_addresse: this.state.id_addresse, ref_intervention: this.state.ref_intervention,batiment_name:this.state.batiment_name });

        } else {
          this.setState({ message: 'Opération échouée, veuillez vérifier votre connexion et réessayer' })
        }
      })
      .catch(async (error) => {
        console.log("ERROR API refused logement URL : " + error);
        this.setState({ message: 'Opération échouée, veuillez vérifier votre connexion et réessayer' })
        console.log('==============================');
      });
  }

  render() {

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.Appt,batiment_name:this.state.batiment_name })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Passages</Text>
          <Text style={{ color: "#ffffff", backgroundColor: '#224D88', padding: 5, borderRadius: 10, borderStyle: 'solid', position: 'absolute', right: 10, fontSize: 15, fontWeight: 'bold' }}>{this.state.Appt ? 'Appt ' + this.state.Appt : '---'}</Text>

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


          {this.state.list_passages.length > 0 ?
            this.state.list_passages.map((detail, index) =>
              this.state.list_passages[index].status == "pending" ?
                (
                  <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('fiche_passage', { id_passage: detail.id, ref_passage: index + 1, id_logement: this.state.id_logement, id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.Appt,batiment_name:this.state.batiment_name })} >
                    <View style={styles.intContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', width: 210 }} numberOfLines={1}>Passage {index + 1}</Text>
                        <Text style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: '#f0932b', padding: 5, borderRadius: 10 }}>À faire</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
                :
                this.state.list_passages[index].status == "absent" ?
                  (
                    <TouchableOpacity key={index}>
                      <View style={styles.intContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                          <Text style={{ fontSize: 20, color: "grey", width: 210 }} numberOfLines={1}>Passage {index + 1}</Text>
                          <Text style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: '#eb4d4b', padding: 5, borderRadius: 10 }}>Absent</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                  :
                this.state.list_passages[index].status == "refuse" ?
                  (
                    <TouchableOpacity key={index}>
                      <View style={styles.intContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                          <Text style={{ fontSize: 20, color: "grey", width: 210 }} numberOfLines={1}>Passage {index + 1}</Text>
                          <Text style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: '#eb4d4b', padding: 5, borderRadius: 10 }}>Refusé</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                  :
                  this.state.list_passages[index].status == "ok" ?
                    (
                      <TouchableOpacity key={index}>
                        <View style={styles.intContainer}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                            <Text style={{ fontSize: 20, color: "grey", width: 210 }} numberOfLines={1}>Passage {index + 1}</Text>
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

          {
            this.state.list_passages.length > 0 ?
              (
                <View>
                  <TouchableOpacity style={styles.refuse_btn, { alignContent: 'center', margin: 15, marginBottom: 60 }} onPress={() => this.refuse_btn()}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#eb4d4b', padding: 20, borderRadius: 20, width: '100%' }}>Refuser le logement</Text>
                  </TouchableOpacity>
                  <Text style={styles.TextStyle}>{this.state.message}</Text>
                </View>
              ) :
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
  refuse_btn: {
    color: '#000000',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    color: '#224D88',
    marginBottom: 50
  },
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
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


export default list_passages;
