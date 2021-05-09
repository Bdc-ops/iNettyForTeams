import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, TextInput, BackHandler,Alert,PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';

//import SignatureCapture from 'react-native-signature-capture';
import ButtonSpinner from 'react-native-button-spinner';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import RadioButtonRN from 'radio-buttons-react-native';
import CardView from 'react-native-cardview';
import ImageCompressor from '@trunkrs/react-native-image-compressor'

const waiting = require('../../resources/images/waiting.png');

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
      cuisine_array : [],
      salle_de_bain_array : [],
      wc_array : [],
      autres_array : [],
      additional_informations_array:[],
      img_c_0: '',
      img_c_1: '',
      img_s_0: '',
      img_s_1: '',
      img_w_0: '',
      img_w_1: '',
      img_a_0: '',
      img_a_1: '',
      //img_signature: '',
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


  handlechoosePhoto(indicator) {
    const options = {
      title: 'Choose an Image',
      base64: true
    };
    ImagePicker.launchImageLibrary(options, response => {
      const path = response.uri;
      //RNFS.readFile(path, 'base64').then(res => {
        console.log('Image uplaoded - Path : ' + path);
        indicator == 'c_0' ? this.setState({ img_c_0: path }) :
          indicator == 'c_1' ? this.setState({ img_c_1: path }) :
            indicator == 's_0' ? this.setState({ img_s_0: path }) :
              indicator == 's_1' ? this.setState({ img_s_1: path }) :
                indicator == 'w_0' ? this.setState({ img_w_0: path }) :
                  indicator == 'w_1' ? this.setState({ img_w_1: path }) :
                    indicator == 'a_0' ? this.setState({ img_a_0: path }) :
                      indicator == 'a_1' ? this.setState({ img_a_1: path }) :
                        ''
      //});




    });
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
  async take_picture(indicator){
      try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: "Permission",
                message: "swahiliPodcast needs to read storage "
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission given");

          const options = {
            title: 'Choose an Image',
            base64: true
          };
          ImagePicker.launchCamera(options, (response) => {
            const path = response.uri;
              console.log('Image uplaoded - Path : ' + path);
              indicator == 'c_0' ? this.setState({ img_c_0: path }) :
                indicator == 'c_1' ? this.setState({ img_c_1: path }) :
                  indicator == 's_0' ? this.setState({ img_s_0: path }) :
                    indicator == 's_1' ? this.setState({ img_s_1: path }) :
                      indicator == 'w_0' ? this.setState({ img_w_0: path }) :
                        indicator == 'w_1' ? this.setState({ img_w_1: path }) :
                          indicator == 'a_0' ? this.setState({ img_a_0: path }) :
                            indicator == 'a_1' ? this.setState({ img_a_1: path }) :
                              ''
          });
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.log(err);
      }
  }





  async validate_data(cuisine_array,salle_de_bain_array,wc_array,autres_array,additional_informations_array){
    return new Promise(async (resolve, reject) => {


        this.state.img_c_0 ? 
          await RNFS.readFile(this.state.img_c_0, 'base64')
          .then(async (res) => {
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 1 Compressed and Saved');
                this.setState({img_c_0:res});
              });
          })
        : ''

        this.state.img_c_1 ? 
          await RNFS.readFile(this.state.img_c_1, 'base64')
          .then(async (res) => { 
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 2 Compressed and Saved');
                this.setState({img_c_1:res});
              });
        }) 
        : ''


        this.state.img_s_0 ? 
          await RNFS.readFile(this.state.img_s_0, 'base64')
          .then(async (res) => { 
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 3 Compressed and Saved');
                this.setState({img_s_0:res});
              });
        }) 
        : ''


        this.state.img_s_1 ? 
          await RNFS.readFile(this.state.img_s_1, 'base64')
          .then(async (res) => { 
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 4 Compressed and Saved');
                this.setState({img_s_1:res});
              });
        }) 
        : ''


        this.state.img_w_0 ? 
          await RNFS.readFile(this.state.img_w_0, 'base64')
          .then(async (res) => { 
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 5 Compressed and Saved');
                this.setState({img_w_0:res});
              });
        }) 
        : ''


        this.state.img_w_1 ? 
          await RNFS.readFile(this.state.img_w_1, 'base64')
          .then(async (res) => { 
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 6 Compressed and Saved');
                this.setState({img_w_1:res});
              });
        }) 
        : ''


        this.state.img_a_0 ? 
          await RNFS.readFile(this.state.img_a_0, 'base64')
          .then(async (res) => { 
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 7 Compressed and Saved');
                this.setState({img_a_0:res});
              });
        }) 
        : ''


        this.state.img_a_1 ? 
          await RNFS.readFile(this.state.img_a_1, 'base64')
          .then(async (res) => { 
              await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
              .then(async (res) =>{
                console.log('Image 8 Compressed and Saved');
                this.setState({ img_a_1:res});
              });
        }) 
        :
        ''
        
        /*setTimeout(() => {
          this.send_pictures();
        }, 8000);*/
        this.setState({
          cuisine_array:cuisine_array,
          salle_de_bain_array:salle_de_bain_array,
          wc_array:wc_array,
          autres_array:autres_array,
          additional_informations_array:additional_informations_array,
          validator: 1
        });
        resolve("api ok");



      });
  }
  
  async send_data_to_server() {
    

    return new Promise(async (resolve, reject) => {


          const data_passage= {
            auth_token: this.state.token,
            id_passage: this.state.id_passage,
            cuisine: {
              debit_avant: this.state.cuisine_array[0],
              debit_apres: this.state.cuisine_array[1],
              bonetat: this.state.cuisine_array[2],
              collee: this.state.cuisine_array[3],
              a_remplacer: this.state.cuisine_array[4],
              bouche: this.state.cuisine_array[5],
              hotte: this.state.cuisine_array[6],
            },
            salle_de_bain: {
              bonetat: this.state.salle_de_bain_array[2],
              collee: this.state.salle_de_bain_array[3],
              a_remplacer: this.state.salle_de_bain_array[4],
              bouche: this.state.salle_de_bain_array[5],
              debit_avant: this.state.salle_de_bain_array[0],
              debit_apres: this.state.salle_de_bain_array[1],
            },
            wc: {
              bonetat: this.state.wc_array[2],
              collee: this.state.wc_array[3],
              a_remplacer: this.state.wc_array[4],
              bouche: this.state.wc_array[5],
              debit_avant: this.state.wc_array[0],
              debit_apres: this.state.wc_array[1],
            },
            autres: {
              bonetat: this.state.autres_array[2],
              collee: this.state.autres_array[3],
              a_remplacer: this.state.autres_array[4],
              bouche: this.state.autres_array[5],
              debit_avant: this.state.autres_array[0],
              debit_apres: this.state.autres_array[1],
            },
            details:{
              comment: this.state.additional_informations_array[0],
              refs_des_bouches: this.state.additional_informations_array[1]
            }
          };

          console.log(data_passage);
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
                      console.log('Rapport data Sent : ' + response.status);
                      //this.props.navigation.navigate('list_passages', { id_entervention: this.state.id_entervention, id_passage: this.state.id_passage, id_logement: this.state.id_logement });
                      //this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, id_addresse: this.state.id_addresse, ref_intervention: this.state.ref_intervention });   
                      resolve("api ok");
                    }
                  })
                  .catch(error => {
                    console.log('Rapport non-envoyer, Error : ' + error);
                    alert('Rapport data non-envoyer');
                    resolve("api ok");
                  });       
    });
  }

async send_pictures(){
  console.log('send pictures fucntion');
  await axios(
    {
      method: 'post',
      url: `https://inetty.apps-dev.fr/api/mobile/interventions/pasages/etat-des-lieux-logement-pictures`,
      headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
      data: {
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
        },
      }
    }
  )
    .then(async (response) => {
      console.log('reponse : ' + response.status);
      if (response.status === 200) {
        console.log('Rapport pictures Sent : ' + response.status);
        //this.props.navigation.navigate('list_passages', { id_entervention: this.state.id_entervention, id_passage: this.state.id_passage, id_logement: this.state.id_logement });
        //this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, id_addresse: this.state.id_addresse, ref_intervention: this.state.ref_intervention });
        //resolve("api ok");
        this.setState({validator: 1});
      }
    })
    .catch(error => {
      console.log('Rapport pictures non-envoyer, Error : ' + error);
      alert('Rapport pictures non-envoyer');
      //resolve("api ok");
    });
}



  absent_btn() {
    Alert.alert(
      "IMPORTANT",
      "Voulez-vous vraiment marker le " + this.state.ref_passage+" comme absent ?",
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

test(c){
  alert(c[0]);
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
    var cuisine_array=[];
    var salle_de_bain_array=[];
    var wc_array=[];
    var autres_array=[];
    var additional_informations_array=[];
    
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
                  returnKeyLabel={"next"} onChangeText={(text) => cuisine_array[0] = text} keyboardType='numeric'></TextInput>

                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => cuisine_array[1] = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => cuisine_array[2] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => cuisine_array[3] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => cuisine_array[4] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => cuisine_array[5] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => cuisine_array[6] = e.value}
                />

              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'c_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_c_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'c_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_c_1 ? 'Image uploadé' : 'Image Après'}</Text>
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
                  returnKeyLabel={"next"} onChangeText={(text) => salle_de_bain_array[0] = text} keyboardType='numeric'></TextInput>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => salle_de_bain_array[1] = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => salle_de_bain_array[2] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => salle_de_bain_array[3] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => salle_de_bain_array[4] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => salle_de_bain_array[5] = e.value}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 's_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_s_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 's_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_s_1 ? 'Image uploadé' : 'Image Après'}</Text>
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
                  returnKeyLabel={"next"} onChangeText={(text) => wc_array[0] = text} keyboardType='numeric'></TextInput>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => wc_array[1] = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => wc_array[2] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => wc_array[3] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => wc_array[4] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => wc_array[5] = e.value}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'w_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_w_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'w_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_w_1 ? 'Image uploadé' : 'Image Après'}</Text>
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
                  returnKeyLabel={"next"} onChangeText={(text) => autres_array[0] = text} keyboardType='numeric'></TextInput>
                <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                  returnKeyLabel={"next"} onChangeText={(text) => autres_array[1] = text} keyboardType='numeric'></TextInput>
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => autres_array[2] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => autres_array[3] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => autres_array[4] = e.value}
                />
                <RadioButtonRN
                  style={{ flexDirection: 'row', width: '90%', height: 30, marginTop: 10 }}
                  boxStyle={{ width: '50%' }}
                  textStyle={{ margin: 10 }}
                  data={data}
                  selectedBtn={(e) => autres_array[5] = e.value}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'a_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_a_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'a_1')} style={{ width: '45%' }}>
                <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%' }}>{this.state.img_a_1 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Commentaire</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => additional_informations_array[0] = text}></TextInput>
          </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.buildingsContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Réf des bouches</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => additional_informations_array[1] = text}></TextInput>
          </CardView>


          {
            /*
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
            */
          }



          <CardView cardElevation={10} cornerRadius={20} style={styles.BouttonsContainer}>
            <ButtonSpinner style={{ backgroundColor: '#224D88', borderRadius: 20, color: '#ffffff' }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }} onPress={this.validate_data.bind(this,cuisine_array,salle_de_bain_array,wc_array,autres_array,additional_informations_array)}>
                <Text style={{ textAlign: 'center', color: '#ffffff', padding: 5, }}>{this.state.validator ? 'Re-valider' : 'Valider l\'appartement'}</Text>
              </ButtonSpinner>
             
             {
               this.state.validator ?
               (
                <ButtonSpinner style={{ backgroundColor: '#00BFA6', borderRadius: 20, color: '#ffffff' }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }}
                onPress={this.send_data_to_server.bind(this)}>
                <Text style={{ textAlign: 'center', color: '#ffffff', padding: 5, }}>Envoyer le rapport de l 'appartement</Text>
            </ButtonSpinner>
               )
               :
               (
                <ButtonSpinner style={{ backgroundColor: 'gray', borderRadius: 20, color: '#ffffff' }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }}
                onPress={() => alert('Veuillez valider l\'appartement !')}>
                  <Text style={{ textAlign: 'center', color: '#ffffff', padding: 5, }}>Envoyer le rapport de l 'appartement</Text>
              </ButtonSpinner>
               )



             }

            


            {/*
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
                )*/
            }


                <TouchableOpacity style={styles.refuse_btn, { alignContent: 'center', margin: 15, marginBottom: 20 }} onPress={() => this.send_pictures()}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#eb4d4b', padding: 20, borderRadius: 20, width: '100%' }}>Marquer le passage comme absent</Text>
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
