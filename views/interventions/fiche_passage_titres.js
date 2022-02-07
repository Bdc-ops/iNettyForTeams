import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, TextInput, BackHandler,Alert,PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';
import ButtonSpinner from 'react-native-button-spinner';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import RadioButtonRN from 'radio-buttons-react-native';
import CardView from 'react-native-cardview';
import ImageCompressor from '@trunkrs/react-native-image-compressor'

const waiting = require('../../resources/images/waiting.png');

class fiche_passage_titres extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      validator: '',
      day: '',
      id_passage: '',
      id_entervention: '',
      id_logement: '',
      indicator: '',
      list_interventions: [],
      id_addresse: '',
      ref_intervention: '',
      timer: 1,
      token: '',
      Appt: '',
      ref_passage: '',
      data_passage:''
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 0 });
    AsyncStorage.getItem('user_token')
      .then(token => {
        if (token) {

          const day = this.props.navigation.getParam('day', null);
          const indicator = this.props.navigation.getParam('indicator', null);
          const id_logement = this.props.navigation.getParam('id_logement', null);
          const id_entervention = this.props.navigation.getParam('id_entervention', null);
          const id_passage = this.props.navigation.getParam('id_passage', null);
          const ref_intervention = this.props.navigation.getParam('ref_intervention', null);
          const id_addresse = this.props.navigation.getParam('id_addresse', null);
          const Appt = this.props.navigation.getParam('appt', null);
          const ref_passage = this.props.navigation.getParam('ref_passage', null);

          this.setState({
            day: day,
            id_passage: id_passage,
            indicator: indicator,
            token: token,
            id_entervention: id_entervention,
            id_logement: id_logement,
            ref_intervention: ref_intervention,
            id_addresse: id_addresse,
            Appt: Appt,
            ref_passage: ref_passage,
          });
          console.log('Fiche passage - Num appart : ' + this.state.Appt + ' - Id addresse : ' + this.state.id_addresse);

        } else {
          //navigate('error');
        }
      });
  }

  componentWillUnmount() {
    this.handler.remove()
    BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }


  popup_alert(indicator){
    Alert.alert(
      "Selectionner une option",
      "",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Prendre une photo", onPress: () => this.take_picture(indicator),

        },
        {
          text: "Choisir depuis..", onPress: () => this.handlechoosePhoto(indicator)

        }
      ],
      { cancelable: false }
    );
  }



/*async send_pictures(resolve){
  console.log('send pictures fucntion');
  const data_pictures = {
    auth_token: this.state.token,
    id_passage: this.state.id_passage,
    cuisine: {
      img_avant:this.state.img_c_0,
      img_apres:this.state.img_c_1,
    },
    salle_de_bain: {
      img_avant:this.state.img_s_0,
      img_apres:this.state.img_s_1,
    },
    wc: {
      img_avant:this.state.img_w_0,
      img_apres:this.state.img_w_1,
    },
    autres: {
      img_avant:this.state.img_a_0,
      img_apres:this.state.img_a_1
    }
  };
    await axios(
    {
      method: 'post',
      url: `https://inetty.apps-dev.fr/api/mobile/interventions/pasages/etat-des-lieux-logement-pictures`,
      headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
      data: data_pictures,
      }
    )
      .then(async (response) => {
        console.log('reponse : ' + response.status);
        if (response.status === 200) {
          console.log('Rapport pictures Sent : ' + response.status);
          this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, id_addresse: this.state.id_addresse, ref_intervention: this.state.ref_intervention });
          resolve("api ok");
        }
      })
      .catch(error => {
        console.log('Rapport pictures non-envoyer, Error : ' + error);
        alert('Rapport pictures non-envoyer');
        resolve("api ok");
      });
}*/


  render() {
    var val = [];
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>

        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('fiche_passage_pictures', { id_passage: this.state.id_passage, ref_passage: this.state.ref_passage + 1, id_logement: this.state.id_logement, id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.Appt })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Légendes des images</Text>
          <Text style={{ color: "#ffffff", backgroundColor: '#224D88', padding: 5, borderRadius: 10, borderStyle: 'solid', position: 'absolute', right: 10, fontSize: 15, fontWeight: 'bold' }}>{this.state.ref_passage ? 'Passage ' + this.state.ref_passage : '---'}</Text>

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



          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Cuisine</Text>
            <View style={{ flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%',}}
              returnKeyLabel={"next"} onChangeText={(text) =>  val[0]= text}></TextInput>

            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%',}}
              returnKeyLabel={"next"} onChangeText={(text) =>  val[1]= text}></TextInput>
              
            </View>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Salle de bains</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 's_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={this.state.img_s_0 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_s_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 's_1')} style={{ width: '45%' }}>
                <Text style={this.state.img_s_1 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_s_1 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>WC</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'w_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={this.state.img_w_0 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_w_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'w_1')} style={{ width: '45%' }}>
                <Text style={this.state.img_w_1 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_w_1 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>

          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Autres</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'a_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={this.state.img_a_0 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_a_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'a_1')} style={{ width: '45%' }}>
                <Text style={this.state.img_a_1 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_a_1 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>
          </CardView>


        


          <CardView cardElevation={10} cornerRadius={20} style={styles.BouttonsContainer}>
            <ButtonSpinner style={{ backgroundColor: '#00BFA6', borderRadius: 20, color: '#ffffff' }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }} onPress={this.validate_data.bind(this)}>
                <Text style={{ textAlign: 'center', color: '#ffffff', padding: 5, }}>Envoyer et terminer</Text>
              </ButtonSpinner>


          </CardView>



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
  end_btn: {
    color: '#000000',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: '100%'
  },
  send_btn: {
    color: 'gray',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: '100%'
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
    padding: 5,
  },
  BouttonsContainer: {
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


});


export default fiche_passage_titres;
