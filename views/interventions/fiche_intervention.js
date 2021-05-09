import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const waiting = require('../../resources/images/waiting.png');
const buildings = require('../../resources/images/buildings.png');
import CardView from 'react-native-cardview';
import SignatureCapture from 'react-native-signature-capture';

class fiche_intervention extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      day: '',
      id_entervention: '',
      indicator: '',
      list_interventions: [],
      list_adresses: [],
      timer: 1,
      token: '',
      img_signature: '',
      validator:''
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 1 });
    AsyncStorage.getItem('user_token')
      .then(token => {
        if (token) {
          const id_entervention = this.props.navigation.getParam('id_entervention', null);
          const indicator = this.props.navigation.getParam('indicator', null);
          const day = this.props.navigation.getParam('day', null);
          console.log('--------------------------------');
          console.log('id entervention : ' + id_entervention);
          console.log('Indicator : ' + indicator);
          console.log('Day : ' + day);
          console.log('--------------------------------');
          this.setState({
            day: day,
            id_entervention: id_entervention,
            indicator: indicator,
            token: token
          });
          console.log('inter :' + id_entervention);
          this.Get_details_interventions(token, id_entervention);
          this.Get_intervention_adresses(token, id_entervention);

        } else {
          //navigate('error');
        }
      });
  }

  componentWillUnmount() {
    this.handler.remove()
    BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }

  async Get_details_interventions(token, id_entervention) {
    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/weekly/list`, { auth_token: `${token}` })
      .then(async (response) => {
        console.log('==============================');
        console.log('Liste des interventions');
        console.log('Reponse API status : ' + response.status);
        if (response.data.success == true) {
          console.log('msg success' + response.data.success);
          console.log('List correctly mapped');
          let list_intervention = response.data.ents_list;
          var data = [];
          await Object.keys(list_intervention, id_entervention).forEach(async function (index) {
            if (list_intervention[index].id === id_entervention) {
              console.log('id intervention' + id_entervention);
              data.push(list_intervention[index]);
            }
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

  async Get_intervention_adresses(token, id_entervention) {
    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/${id_entervention}/addresses`, { auth_token: `${token}` })
      .then(async (response) => {
        console.log('==============================');
        console.log('Liste des adresses');
        console.log('Reponse API status : ' + response.status);
        if (response.data.success == true) {
          console.log('msg success' + response.data.success);
          console.log('List correctly mapped');
          let list_adresses = response.data.addrs;
          var data_adr = [];
          await Object.keys(list_adresses).forEach(async function (index) {
            data_adr.push(list_adresses[index]);
            console.log('id:', list_adresses[index].id);
          });
          this.setState({ list_adresses: data_adr });
        }
        console.log('==============================');
      })
      .catch(async (error) => {
        console.log("ERROR API Adresses liste URL : " + error);
        console.log('==============================');
      });
  }



  async end_intervention(id_entervention) {
    //await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/finish/${id_entervention}`, { auth_token: `${this.state.token}` })
    const signature_data = {
      signature : this.state.img_signature
    }
    await axios(
      {
        method: 'post',
        url: `https://inetty.apps-dev.fr/api/mobile/interventions/finish/${id_entervention}`,
        headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
        data: signature_data
      }
    )
      .then(async (response) => {
        console.log('==============================');
        console.log('Terminer l\'interventions');
        console.log('Reponse API status : ' + response.status);
        if (response.data.success == true) {
          console.log('msg success' + response.data.success);
          console.log('Intervention Terminee avec success');
          alert('L\'intervention est passer comme terminer');
          this.props.navigation.navigate('list_interventions');
        }
        console.log('==============================');
      })
      .catch(async (error) => {
        console.log("ERROR API terminer l\'interventions URL : " + error);
        console.log('==============================');
      });
  }




  _onSaveEvent(result) {
    if (result.encoded.length > 2000) {
      console.log('Signature enregistrer');
      this.setState({ img_signature: result.encoded, validator: 1 });
      alert('Rapport valider');
      console.log(result.encoded.length)
    } else {
      alert('Veuillez saisir votre signature');

    }
  }

  _onDragEvent() {
    console.log("dragged");
  }


  resetSign() {
    this.refs["sign"].resetImage();
  }


validsignature(){
  this.refs["sign"].saveImage();
}

  render() {

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>

        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.state.indicator == 'interventions' ? this.props.navigation.navigate('list_interventions') : this.props.navigation.navigate('List_plannings', { plannings_day: this.state.day })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Fiche d'intervention</Text>
          <Text style={{ color: "#ffffff", backgroundColor: '#224D88', padding: 5, borderRadius: 10, borderStyle: 'solid', position: 'absolute', right: 10, fontSize: 15, fontWeight: 'bold' }}>{this.state.timer != 1 ? this.state.list_interventions[0].ref_devis : '---'}</Text>

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
              (<View></View>)
          }


          {this.state.list_interventions.length > 0 ?
            <View>
              <CardView cardElevation={10} cornerRadius={20} style={styles.interventionContainer}>
                <View style={styles.intContainer}>
                  <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 20, textDecorationLine: 'underline' }}>Informations du client</Text>
                  <View>
                    <Text style={{ marginBottom: 20 }}>Client : <Text style={{ color: "#224D88", fontWeight: 'bold' }}>{this.state.list_interventions[0].nom_client ? this.state.list_interventions[0].nom_client : '- - - -'}</Text></Text>
                  </View>
                  <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                    <Image
                      style={{ width: 25, height: 25, marginRight: 5 }}
                      source={require('../../resources/images/clock.png')}
                    />
                    <Text>{this.state.list_interventions[0].date_du ? this.state.list_interventions[0].date_du : '- - - -'} - {this.state.list_interventions[0].date_au ? this.state.list_interventions[0].date_au : '- - - -'}</Text>
                  </View>
                  <Text style={{ marginLeft: 30 }}>Heure d'arrivée : {this.state.list_interventions[0].heure_arrive ? this.state.list_interventions[0].heure_arrive : '- - - -'}</Text>

                  <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', }}>
                    <Image
                      style={{ width: 25, height: 25, marginRight: 5 }}
                      source={require('../../resources/images/placeholder.png')}
                    />
                    <Text>Lieu : {this.state.list_interventions[0].lieu_execution ? this.state.list_interventions[0].lieu_execution : '- - - -'}</Text>
                  </View>
                  <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', }}>
                    <Image
                      style={{ width: 25, height: 25, marginRight: 5 }}
                      source={require('../../resources/images/contact.png')}
                    />
                    <Text>Contact : {this.state.list_interventions[0].nom_contact ? this.state.list_interventions[0].nom_contact : '- - - -'}</Text>
                  </View>


                  {
                    this.state.list_interventions[0].statut == "terminée" ?
                      (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: '#6ab04c', padding: 5, borderRadius: 10 }}>{this.state.list_interventions[0].statut}</Text>)
                      : this.state.list_interventions[0].statut == "brouillon" ?
                        (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: 'blue', padding: 5, borderRadius: 10 }}>{this.state.list_interventions[0].statut}</Text>)
                        : this.state.list_interventions[0].statut == "affectée" ?
                          (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: '#f0932b', padding: 5, borderRadius: 10 }}>{this.state.list_interventions[0].statut}</Text>)
                          : (<Text style={{ position: 'absolute', right: 15, bottom: 13, color: '#ffffff', backgroundColor: 'gray', padding: 5, borderRadius: 10 }}>-----</Text>)

                  }

                </View>
              </CardView>

              <CardView cardElevation={10} cornerRadius={20} style={styles.interventionContainer}>
                <View style={styles.intContainer}>

                  <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 20, textDecorationLine: 'underline' }}>Liste des adresses</Text>

                  {
                    this.state.list_adresses.length > 0 ?
                      this.state.list_adresses.map((detail, index) =>

                        <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('list_logements', { id_entervention: this.state.list_interventions[0].id, ref_intervention: this.state.list_interventions[0].ref_devis, id_addresse: detail.id })}>
                          <View style={styles.buildingsContainer}>
                            <Text style={{ width: '100%', color: '#ffffff' }}>{detail.adresse_int ? detail.adresse_int : '- - - -'}</Text>

                            {/*<View style={{ alignItems: 'center', justifyContent: 'center', }}><Image style={styles.img_building} source={buildings} /></View>*/}
                          </View>
                        </TouchableOpacity>
                      )
                      :
                      (<Text>Aucune adresse à afficher</Text>)
                  }
                </View>
              </CardView>







              {
                this.state.list_interventions[0].statut == "terminée" ?
                  (
                    <TouchableOpacity style={{ alignContent: 'center', margin: 15, marginBottom: 60 }}>
                      <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'gray', padding: 20, borderRadius: 20, width: '100%' }}>L'intervention est déjà terminée</Text>
                    </TouchableOpacity>
                  )
                  :
                  (
                    <CardView cardElevation={10} cornerRadius={20} style={styles.SignatureContainer}>
                    <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Signature</Text>
                    <View style={styles.signature_border}>
                      <SignatureCapture
                        style={[{ flex: 1 }, styles.signature]}
                        ref="sign"
                        onSaveEvent={this._onSaveEvent.bind(this)}
                        onDragEvent={this._onDragEvent.bind(this)}
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        backgroundColor="#ffffff"
                        strokeColor="#224D88"
                        minStrokeWidth={4}
                        maxStrokeWidth={4}
                        viewMode={"portrait"} />
                    </View>
    
                    <View style={{ flex: 1, flexDirection: "row" }}>
                    {
                      this.state.validator ?
                      (
                        <TouchableOpacity style={styles.signature_buttonStyle}
                        onPress={() => { alert('la signature est été valider') }} >
                        <Text>Supprimer la signature</Text>
                      </TouchableOpacity>
                      )
                      :
                      (<TouchableOpacity style={styles.signature_buttonStyle}
                        onPress={() => { this.resetSign() }} >
                        <Text>Supprimer la signature</Text>
                      </TouchableOpacity>)


                    }
                      

                    </View>
                    
                    <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 10 }} onPress={() => this.validsignature()}>
                      <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'orange', padding: 20, borderRadius: 20, width: '100%' }}>Valider la signature</Text>
                    </TouchableOpacity>

                    {
                      this.state.validator ?
                      (
                    <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 50 }} onPress={() => this.end_intervention(this.state.list_interventions[0].id)}>
                      <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#6ab04c', padding: 20, borderRadius: 20, width: '100%' }}>Terminer l'intervention</Text>
                    </TouchableOpacity>
                      )
                      :
                      (
                    <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 50 }} onPress={() => alert('Veuillez signer pour terminer l\'intervetion')}>
                      <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#999999', padding: 20, borderRadius: 20, width: '100%' }}>Terminer l'intervention</Text>
                    </TouchableOpacity>
                      )
                    }

                    
                  </CardView>


                    
                  )
              }




            </View>
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
  BouttonContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0, height: 1
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 100,
  },
  signature_border: {
    flex: 1,
    borderColor: '#224D88',
    borderWidth: 2,
    height: 200,
  },
  signature: {
    flex: 1,
    borderWidth: 2,
    height: 200,
  },
  signature_buttonStyle: {
    flex: 1, justifyContent: "center", alignItems: "center", height: 50,
    backgroundColor: "#eeeeee",
    margin: 10,
    borderRadius: 20
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
    width: 170,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  intContainer: {

    padding: 15
  },
  interventionContainer: {
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
    padding: 5,
  },
  SignatureContainer:{
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
    padding: 5,
    marginBottom:70,
  },
  buildingsContainer: {
    shadowColor: "#224D88",
    shadowOffset: {
      width: 0, height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#224D88'
  },
});


export default fiche_intervention;
