import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, TextInput, BackHandler,Alert } from 'react-native';
import PhotoUpload from 'react-native-photo-upload';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';
import SignatureCapture from 'react-native-signature-capture';
import ButtonSpinner from 'react-native-button-spinner';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import RadioButtonRN from 'radio-buttons-react-native';

import CardView from 'react-native-cardview';

const waiting = require('../../resources/images/waiting.png');
const buildings = require('../../resources/images/buildings.png');

class fiche_passage extends React.Component {

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
      c: [],
      s: [],
      w: [],
      a: [],
      cmnt: [],
      img_c_0: '',
      img_c_1: '',
      img_s_0: '',
      img_s_1: '',
      img_w_0: '',
      img_w_1: '',
      img_a_0: '',
      img_a_1: '',
      img_signature: '',
      token: '',
      Appt: '',
      ref_passage: '',
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
          //this.Get_details_passage(token, id_passage);
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


  handlechoosePhoto(indicator) {
    const options = {
      title: 'Choose an Image',
      base64: true
    };
    ImagePicker.launchImageLibrary(options, response => {
      const path = response.uri;
      RNFS.readFile(path, 'base64').then(res => {
        console.log('Image uplaoded - Path : ' + path);
        indicator == 'c_0' ? this.setState({ img_c_0: res }) :
          indicator == 'c_1' ? this.setState({ img_c_1: res }) :
            indicator == 's_0' ? this.setState({ img_s_0: res }) :
              indicator == 's_1' ? this.setState({ img_s_1: res }) :
                indicator == 'w_0' ? this.setState({ img_w_0: res }) :
                  indicator == 'w_1' ? this.setState({ img_w_1: res }) :
                    indicator == 'a_0' ? this.setState({ img_a_0: res }) :
                      indicator == 'a_1' ? this.setState({ img_a_1: res }) :
                        ''
      });
    });
  }

  async Get_details_passage(token, id_passage) {
    /*await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/weekly/list`, { auth_token: `${token}` })
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
      });*/
  }

  async terminer(c1, c2, c3, c4, c5, c6, c7, s1, s2, s3, s4, s5, s6, w1, w2, w3, w4, w5, w6, a1, a2, a3, a4, a5, a6, cm1, cm2) {
    this.setState({
      c: [c1 ? c1 : 0, c2 ? c2 : 0, c3 ? c3 : 0, c4 ? c4 : 0, c5 ? c5 : 0, c6 ? c6 : 0, c7 ? c7 : 0],
      s: [s1 ? s1 : 0, s2 ? s2 : 0, s3 ? s3 : 0, s4 ? s4 : 0, s5 ? s5 : 0, s6 ? s6 : 0],
      w: [w1 ? w1 : 0, w2 ? w2 : 0, w3 ? w3 : 0, w4 ? w4 : 0, w5 ? w5 : 0, w6 ? w6 : 0],
      a: [a1 ? a1 : 0, a2 ? a2 : 0, a3 ? a3 : 0, a4 ? a4 : 0, a5 ? a5 : 0, a6 ? a6 : 0],
      cmnt: [cm1 ? cm1 : 0, cm2 ? cm2 : 0]
    });
    console.log('Data enregistrer');
    this.refs["sign"].saveImage();
  }

  _onSaveEvent(result) {
    if (result.encoded.length > 2000) {
      console.log('Signature enregistrer');
      this.setState({ img_signature: result.encoded, validator: 1 });
      alert('Rapport valider');
      console.log(result.encoded.length)
    } else {
      alert('Veuillez signer votre rapport pour le valider !');

    }
  }

  _onDragEvent() {
    console.log("dragged");
  }


  resetSign() {
    this.refs["sign"].resetImage();
  }

  async send_data_to_server() {
    return new Promise(async (resolve, reject) => {
      const data_passage = {
        auth_token: this.state.token,
        id_passage: this.state.id_passage,
        cuisine: {
          bonetat: this.state.c[2],
          collee: this.state.c[3],
          a_remplacer: this.state.c[4],
          bouche: this.state.c[5],
          hotte: this.state.c[6],
          debit_avant: this.state.c[0],
          debit_apres: this.state.c[1],
          img_avant: this.state.img_c_0,
          img_apres: this.state.img_c_1
        },
        salle_de_bain: {
          bonetat: this.state.s[2],
          collee: this.state.s[3],
          a_remplacer: this.state.s[4],
          bouche: this.state.s[5],
          debit_avant: this.state.s[0],
          debit_apres: this.state.s[1],
          img_avant: this.state.img_s_0,
          img_apres: this.state.img_s_1
        },
        wc: {
          bonetat: this.state.w[2],
          collee: this.state.w[3],
          a_remplacer: this.state.w[4],
          bouche: this.state.w[5],
          debit_avant: this.state.w[0],
          debit_apres: this.state.w[1],
          img_avant: this.state.img_w_0,
          img_apres: this.state.img_w_1
        },
        autres: {
          bonetat: this.state.a[2],
          collee: this.state.a[3],
          a_remplacer: this.state.a[4],
          bouche: this.state.a[5],
          debit_avant: this.state.a[0],
          debit_apres: this.state.a[1],
          img_avant: this.state.img_a_0,
          img_apres: this.state.img_a_1
        },
        comment: this.state.cmnt[0],
        signature: this.state.img_signature,
        refs_des_bouches: this.state.cmnt[1]
      };

      await axios(
        {
          method: 'post',
          url: `https://inetty.apps-dev.fr/api/mobile/interventions/pasages/etat-des-lieux-logement`,
          headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
          data: data_passage
        }
      )
        .then(async (response) => {
          console.log('reponse : ' + response.status);
          if (response.status === 200) {
            console.log('ok : ' + response.status);
            alert('Rapport Envoyer');
            this.setState({ img_signature: '' });
            //this.props.navigation.navigate('list_passages', { id_entervention: this.state.id_entervention, id_passage: this.state.id_passage, id_logement: this.state.id_logement });
            this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, id_addresse: this.state.id_addresse, ref_intervention: this.state.ref_intervention });
            resolve("api ok");
          }
        })
        .catch(error => {
          console.log('Rapport non-envoyer, Error : ' + error);
          alert('Rapport non-envoyer');
          resolve("api ok");
        });
    });
  }



  absent_btn() {
    Alert.alert(
      "IMPORTANT",
      "Voulez-vous vraiment marker le " + this.state.ref_passage+" comme absent",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Confirmer", onPress: () => this.mark_as_absent()
        }
      ],
      { cancelable: false }
    );
  }


async mark_as_absent(){
  console.log('==============================');
  console.log('Token : ' + this.state.token);
  console.log('ID Passage : ' + this.state.id_passage);
  await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/pasages/mark-as-absent`, { auth_token: `${this.state.token}`, passage_id: this.state.id_passage })
    .then(async (response) => {
      if (response.status == 200) {
        console.log('Marker le passage comem absent : ' + this.state.id_passage);
        console.log('Reponse API status : ' + response.status);
        this.setState({ message: 'Opération réussie, le passage est marqué comme Absent.' })
        console.log('==============================');
        //this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention });
        this.props.navigation.navigate('list_passages', { id_entervention: this.state.id_entervention, id_passage: this.state.id_passage, id_logement: this.state.id_logement, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.Appt })


      } else {
        this.setState({ message: 'Opération échouée, veuillez vérifier votre connexion et réessayer' })
      }
    })
    .catch(async (error) => {
      console.log("ERROR API mark passage as absent URL : " + error);
      this.setState({ message: 'Opération échouée, veuillez vérifier votre connexion et réessayer' })
      console.log('==============================');
    });

}

  
  render() {
    const data = [
      {
        label: 'Oui',
        value: 1
      },
      {
        label: 'Non',
        value: 0
      }
    ];
    //-----------
    var c1 = 0;
    var c2 = 0;
    var c3 = 0;
    var c4 = 0;
    var c5 = 0;
    var c6 = 0;
    var c7 = 0;
    //-----------
    var s1 = 0;
    var s2 = 0;
    var s3 = 0;
    var s4 = 0;
    var s5 = 0;
    var s6 = 0;
    //-----------
    var w1 = 0;
    var w2 = 0;
    var w3 = 0;
    var w4 = 0;
    var w5 = 0;
    var w6 = 0;
    //-----------
    var a1 = 0;
    var a2 = 0;
    var a3 = 0;
    var a4 = 0;
    var a5 = 0;
    var a6 = 0;
    var cm1 = 0;
    var cm2 = 0;

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>

        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('list_passages', { id_entervention: this.state.id_entervention, id_passage: this.state.id_passage, id_logement: this.state.id_logement, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.Appt })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Fiche passage</Text>
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


            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ flexDirection: 'column', width: '40%' }}>
                <Text style={{ margin: 10, marginBottom: 30, fontSize: 15 }}>Debit avant</Text>
                <Text style={{ margin: 10, marginBottom: 20, fontSize: 15 }}>Debit après</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Bon état</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Collée</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>A remplacer</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Pas de bouche</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Hotte raccordée sur ventilation</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20 }}
                  returnKeyLabel={"next"} onChangeText={(text) => c1 = text} keyboardType='numeric'></TextInput>

                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => c2 = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => c3 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => c4 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => c5 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => c6 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => c7 = e.value}
                />

              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 'c_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_c_0.length > 0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 'c_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_c_1.length > 0 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Salle de bains</Text>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ flexDirection: 'column', width: '40%' }}>
                <Text style={{ margin: 10, marginBottom: 30, fontSize: 15 }}>Debit avant</Text>
                <Text style={{ margin: 10, marginBottom: 20, fontSize: 15 }}>Debit après</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Bon état</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Collée</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>A remplacer</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Pas de bouche</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20 }}
                  returnKeyLabel={"next"} onChangeText={(text) => s1 = text} keyboardType='numeric'></TextInput>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => s2 = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => s3 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => s4 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => s5 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => s6 = e.value}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 's_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_s_0.length > 0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 's_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_s_1.length > 0 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>WC</Text>

            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ flexDirection: 'column', width: '40%' }}>
                <Text style={{ margin: 10, marginBottom: 30, fontSize: 15 }}>Debit avant</Text>
                <Text style={{ margin: 10, marginBottom: 20, fontSize: 15 }}>Debit après</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Bon état</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Collée</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>A remplacer</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Pas de bouche</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20 }}
                  returnKeyLabel={"next"} onChangeText={(text) => w1 = text} keyboardType='numeric'></TextInput>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => w2 = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => w3 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => w4 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => w5 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => w6 = e.value}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 'w_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_w_0.length > 0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 'w_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_w_1.length > 0 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>

          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Autres</Text>

            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ flexDirection: 'column', width: '40%' }}>
                <Text style={{ margin: 10, marginBottom: 30, fontSize: 15 }}>Debit avant</Text>
                <Text style={{ margin: 10, marginBottom: 20, fontSize: 15 }}>Debit après</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Bon état</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Collée</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>A remplacer</Text>
                <Text style={{ margin: 10, fontSize: 15 }}>Pas de bouche</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20 }}
                  returnKeyLabel={"next"} onChangeText={(text) => a1 = text} keyboardType='numeric'></TextInput>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => a2 = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => a3 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => a4 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => a5 = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => a6 = e.value}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 'a_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_a_0.length > 0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handlechoosePhoto.bind(this, 'a_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_a_1.length > 0 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Commentaire</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => cm1 = text}></TextInput>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Réf des bouches</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => cm2 = text}></TextInput>
          </CardView>


          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
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
              <TouchableOpacity style={styles.signature_buttonStyle}
                onPress={() => { this.resetSign() }} >
                <Text>Supprimer la signature</Text>
              </TouchableOpacity>
            </View>
          </CardView>



          <CardView cardElevation={10} cornerRadius={20} style={styles.BouttonsContainer}>
            <TouchableOpacity style={styles.end_btn, { alignContent: 'center', margin: 15 }} onPress={() => this.terminer(c1, c2, c3, c4, c5, c6, c7, s1, s2, s3, s4, s5, s6, w1, w2, w3, w4, w5, w6, a1, a2, a3, a4, a5, a6, cm1, cm2)}>
              <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'orange', padding: 20, borderRadius: 20, width: '100%' }}>{this.state.validator ? 'Re-valider' : 'Valider le rapport'}</Text>
            </TouchableOpacity>


            {
              this.state.validator ?
                (
                  <ButtonSpinner style={{ backgroundColor: '#00BFA6', borderRadius: 20, color: '#ffffff' }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }}
                    onPress={() => this.send_data_to_server()}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', padding: 5, }}>Envoyer le rapport</Text>
                  </ButtonSpinner>
                )
                :
                (
                  <TouchableOpacity style={styles.send_btn, { alignContent: 'center', margin: 15 }} onPress={() => alert('Veuillez valider votre rapport d\'abord !')}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'gray', padding: 20, borderRadius: 20, width: '100%' }}>Envoyer le rapport</Text>
                  </TouchableOpacity>
                )
            }


                <TouchableOpacity style={styles.refuse_btn, { alignContent: 'center', margin: 15, marginBottom: 60 }} onPress={() => this.absent_btn()}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#eb4d4b', padding: 20, borderRadius: 20, width: '100%' }}>Marker le passage comme absent</Text>
                  </TouchableOpacity>
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


export default fiche_passage;
