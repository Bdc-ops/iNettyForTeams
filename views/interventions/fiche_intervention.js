import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, BackHandler,TextInput,Alert,PermissionsAndroid,Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const waiting = require('../../resources/images/waiting.png');
const buildings = require('../../resources/images/buildings.png');
import CardView from 'react-native-cardview';
import SignatureCapture from 'react-native-signature-capture';
import ImageCompressor from '@trunkrs/react-native-image-compressor'
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import moment  from 'moment'

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
      img_signature2: '',
      validator:'',
      validator2:'',
      conclusion:'',
      commentaire:'',
      img_avant:'',
      img_apres:'',
      motif_absence:'',
      signature_client_visibility:0,
      signature_intervenant_visibility:0
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
    const signature_data = {
      int_id:id_entervention,
      auth_token:this.state.token,
      signature : this.state.img_signature,
      //signature_client : this.state.img_signature2?this.state.img_signature2:'',      
      signature_client : this.state.img_signature2,      
      conclusion:this.state.conclusion,
      commentaire:this.state.commentaire,
      img_avant:this.state.img_avant,
      img_apres:this.state.img_apres,
      motif_absence:this.state.motif_absence
     }

  await axios(
    {
      method: 'post',
      url: `https://inetty.apps-dev.fr/api/mobile/interventions/finish`,
      headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
      data: signature_data
    }
  )
    .then(async (response) => {
      console.log('==============================');
      console.log('Terminer l\'interventions');
      console.log('Reponse API status : ' + response.status);
        console.log('==============================');
      console.log(response.data.success);
        console.log('==============================');
      console.log(">>>>>>>",response.data);
        console.log('==============================');
      //console.log(response);
      
      if (response.data.success == true) {
        console.log('msg success' + response.data.success);
        console.log('Intervention Terminee avec success');
        alert('Intervention terminée');
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
      alert('Rapport validé');
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


async validsignature(){
  this.refs["sign"].saveImage();

  this.state.img_avant ? 
  await RNFS.readFile(this.state.img_avant, 'base64')
  .then(async (res) => {
      await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
      .then(async (res) =>{
        console.log('Image 1 Compressed and Saved');
        this.setState({img_avant:res});
      });
  })
: ''

this.state.img_apres ? 
  await RNFS.readFile(this.state.img_apres, 'base64')
  .then(async (res) => { 
      await ImageCompressor.compress(res, {maxWidth: 300,maxHeight: 200})
      .then(async (res) =>{
        console.log('Image 2 Compressed and Saved');
        this.setState({img_apres:res});
      });
}) 
: ''
}


_onSaveEvent2(result) {
  if (result.encoded.length > 2000) {
    console.log('Signature du client enregistrer');
    this.setState({ img_signature2: result.encoded, validator2: 1 });
    alert('Signature du client validée');
    console.log(result.encoded.length)
  } else {
    alert('Veuillez saisir la signature du client');

  }
}

_onDragEvent2() {
  console.log("dragged");
}


resetSign2() {
  this.refs["sign2"].resetImage();
  this.setState({ validator2: '' });

}

async validsignature2(){
  this.refs["sign2"].saveImage();

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


handlechoosePhoto(indicator) {
  const options = {
    title: 'Choose an Image',
    base64: true
  };
  ImagePicker.launchImageLibrary(options, response => {
    const path = response.uri;
      console.log('Image uplaoded - Path : ' + path);
      indicator == 'img_avant' ? this.setState({ img_avant: path }) :
        indicator == 'img_apres' ? this.setState({ img_apres: path }) :
          ''

  });
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
          indicator == 'img_avant' ? this.setState({ img_avant: path }) :
            indicator == 'img_apres' ? this.setState({ img_apres: path }) :
              ''
      });
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.log(err);
  }
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
                    <Text>{this.state.list_interventions[0].date_du ? moment(this.state.list_interventions[0].date_du).format("DD-MM-YYYY") : '- - - -'} - {this.state.list_interventions[0].date_au ? moment(this.state.list_interventions[0].date_au).format("DD-MM-YYYY") : '- - - -'}</Text>
                  </View>
                  <Text style={{ marginLeft: 30 }}>Heure d'arrivée : {this.state.list_interventions[0].heure_arrive ? this.state.list_interventions[0].heure_arrive : '- - - -'}</Text>

                  <View style={{ marginTop: 10,marginBottom:20, alignItems: 'center', flexDirection: 'row', }}>
                    <Image
                      style={{ width: 25, height: 25, marginRight: 5 }}
                      source={require('../../resources/images/placeholder.png')}
                    />
                    <Text>Lieu : {this.state.list_interventions[0].lieu_execution ? this.state.list_interventions[0].lieu_execution : '- - - -'}</Text>
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
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' }}>Informations des contacts</Text>
                        <Text>Nom du 1er contact :{this.state.list_interventions[0].nom_contact ? this.state.list_interventions[0].nom_contact : '- - - -'}</Text>
                        <Text>Tél : {this.state.list_interventions[0].tel_contact ? this.state.list_interventions[0].tel_contact : '- - - -'}
                        {
                          this.state.list_interventions[0].tel_contact ?
                          (
                            <Text style={{ color: "#224D88", fontWeight: 'bold'}} onPress={()=>{Linking.openURL(`tel:${this.state.list_interventions[0].tel_contact}`);} }> (Appeler le contact)</Text>
                          )
                          :
                          (<Text></Text>)

                        }
                        </Text>
                      
                        <Text style={{marginTop:20}}>Nom du 2eme contact :{this.state.list_interventions[0].nom_contact_2 ? this.state.list_interventions[0].nom_contact_2 : '- - - -'}</Text>
                        <Text>Tél : {this.state.list_interventions[0].tel_contact_2 ? this.state.list_interventions[0].tel_contact_2 : '- - - -'}
                        {
                          this.state.list_interventions[0].tel_contact_2 ?
                          (
                            <Text style={{ color: "#224D88", fontWeight: 'bold'}} onPress={()=>{Linking.openURL(`tel:${this.state.list_interventions[0].tel_contact_2}`);} }> (Appeler le contact)</Text>
                          )
                          :
                          (<Text></Text>)

                        }
                        </Text>
                      
                      </View>
              </CardView>

              <CardView cardElevation={10} cornerRadius={20} style={styles.interventionContainer}>
                      <View style={styles.intContainer}>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' }}>Définition</Text>
                        <Text>{this.state.list_interventions[0].def_chantier ? this.state.list_interventions[0].def_chantier : '- - - -'}</Text>
                      
                      </View>
              </CardView>

              <CardView cardElevation={10} cornerRadius={20} style={styles.interventionContainer}>
                      <View style={styles.intContainer}>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' }}>Description</Text>
                        <Text>{this.state.list_interventions[0].desc_installations ? this.state.list_interventions[0].desc_installations : '- - - -'}</Text>
                      
                      </View>
              </CardView>

              
              <CardView cardElevation={10} cornerRadius={20} style={styles.interventionContainer}>
                      <View style={styles.intContainer}>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' }}>Observations</Text>
                        <Text>{this.state.list_interventions[0].observations ? this.state.list_interventions[0].observations : '- - - -'}</Text>
                      
                      </View>
              </CardView>


              <CardView cardElevation={10} cornerRadius={20} style={styles.interventionContainer}>
                <View style={styles.intContainer}>
                  <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 20, textDecorationLine: 'underline' }}>Liste des adresses ({this.state.list_interventions[0].type == 1 ? 'Uniques' : 'Multiples'})</Text>
                  
                  

                  {
                    this.state.list_interventions[0].type == 2 ?
                    this.state.list_adresses.length > 0 ?
                    this.state.list_adresses.map((detail, index) =>
                      <TouchableOpacity key={index} onPress={() => this.state.list_interventions[0].statut == "terminée" ? '' : this.props.navigation.navigate('list_batiments', { id_entervention: this.state.list_interventions[0].id, ref_intervention: this.state.list_interventions[0].ref_devis, id_addresse: detail.id })}>
                        <View style={styles.buildingsContainer}>
                          <Text style={{ width: '100%', color: '#ffffff' }}>{detail.adresse_int ? detail.adresse_int : '- - - -'}</Text>
                          <TouchableOpacity style={{marginTop:10}} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query='+detail.adresse_int)}><Text style={{color:'#fff',fontWeight:'bold', textDecorationLine: 'underline'}}>Voir la carte</Text></TouchableOpacity>

                        </View>
                      </TouchableOpacity>
                    )
                    :
                    (
                        <View>
                        <View style={styles.buildingsContainer}>
                          <Text style={{ width: '100%', color: '#ffffff',textTransform: 'capitalize' }}>{this.state.list_interventions[0].lieu_execution ? this.state.list_interventions[0].lieu_execution : 'Aucune adresse à afficher'}</Text>
                          <TouchableOpacity style={{marginTop:10}} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query='+this.state.list_interventions[0].lieu_execution)}><Text  style={{color:'#fff',fontWeight:'bold', textDecorationLine: 'underline'}}>Voir la carte</Text></TouchableOpacity>
                        </View>
                      </View>)
                    :
                    this.state.list_adresses.length > 0 ?
                      this.state.list_adresses.map((detail, index) =>

                        <View key={index}>
                          <View style={styles.buildingsContainer}>
                            <Text style={{ width: '100%', color: '#ffffff',textTransform: 'capitalize' }}>{detail.adresse_int ? detail.adresse_int : '- - - -'}</Text>
                            <TouchableOpacity style={{marginTop:10}} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query='+detail.adresse_int)}><Text style={{color:'#fff',fontWeight:'bold', textDecorationLine: 'underline'}}>Voir la carte</Text></TouchableOpacity>

                          </View>
                        </View>
                      )
                      :
                      (
                        <View>
                        <View style={styles.buildingsContainer}>
                          <Text style={{ width: '100%', color: '#ffffff',textTransform: 'capitalize' }}>{this.state.list_interventions[0].lieu_execution ? this.state.list_interventions[0].lieu_execution : 'Aucune adresse à afficher'}</Text>
                          <TouchableOpacity style={{marginTop:10}} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query='+this.state.list_interventions[0].lieu_execution)}><Text  style={{color:'#fff',fontWeight:'bold', textDecorationLine: 'underline'}}>Voir la carte</Text></TouchableOpacity>
                        </View>
                      </View>)
                      

                  }
                </View>
              </CardView>


                  {
                    this.state.list_interventions[0].statut == "affectée" ?
                    this.state.list_interventions[0].type == 1 ?
                    (<CardView cardElevation={10} cornerRadius={20} style={styles.interventionContainer}>
                      <View style={styles.intContainer}>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' }}>Conclusion</Text>
                        <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 20 }}
                          returnKeyLabel={"next"} onChangeText={(text) => this.setState({conclusion:text})}  multiline={true}></TextInput>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' }}>Images</Text>
                        
                        <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.popup_alert.bind(this, 'img_avant')} style={{ width: '45%',margin:10 }}>
                          <Text style={this.state.img_avant ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_avant ? 'Image uploadé' : 'Image Avant'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.popup_alert.bind(this, 'img_apres')} style={{ width: '45%',margin:10 }}>
                          <Text style={this.state.img_apres ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_apres ? 'Image uploadé' : 'Image Après'}</Text>
                        </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' }}>Commentaires</Text>
                        <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 20 }}
                          returnKeyLabel={"next"} onChangeText={(text) => this.setState({commentaire:text})}  multiline={true}></TextInput>
                        

                      </View>
                    </CardView>)
                    :
                    (<Text style={{display:'none'}}></Text>)

                    :
                    (<Text style={{display:'none'}}></Text>)
                  }
              

              {
              this.state.list_interventions[0].statut == "affectée" ?
                    this.state.signature_client_visibility > 0 ?
                    (
                      <CardView cardElevation={10} cornerRadius={20} style={styles.SignatureClientContainer}>
                          <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Signature du client</Text>
                          <View style={styles.signature_border}>
                            <SignatureCapture
                              style={[{ flex: 1 }, styles.signature]}
                              ref="sign2"
                              onSaveEvent={this._onSaveEvent2.bind(this)}
                              onDragEvent={this._onDragEvent2.bind(this)}
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
                              onPress={() => { this.resetSign2() }} >
                              <Text>Supprimer la signature du client</Text>
                            </TouchableOpacity>
                          </View>
                          
                          <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 10 }} onPress={() => this.validsignature2()}>
                            <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'orange', padding: 20, borderRadius: 20, width: '100%' }}>Valider la signature du client</Text>
                          </TouchableOpacity>
                          {this.state.validator2 ? (<Text style={{ textAlign: 'center',marginBottom:10,color:'green',fontWeight: 'bold'}}>Signature du client : Validée</Text>) : (<Text style={{ textAlign: 'center',marginBottom:10,color:'red',fontWeight: 'bold'}}>Signature du client : Absente</Text>)}          
                          {
                          this.state.validator2 == '' ? 
                          (
                            <View>
                          <Text style={{fontSize: 20, color: "#224D88", fontWeight: 'bold', marginTop: 10, textDecorationLine: 'underline' }}>Motif d'absence</Text>

                          <TextInput style={{  backgroundColor:'#ffffff',borderColor: '#224D88', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 20 }}
                                returnKeyLabel={"next"} onChangeText={(text) => this.setState({motif_absence:text})}  multiline={true}></TextInput>
                            </View>
                          
                          ) 
                          :
                          (<Text style={{display:'none'}}></Text>)
                          }          
                        </CardView>
                    )
                    :
                    (<CardView cardElevation={10} cornerRadius={20} style={styles.SignatureClientContainer}>
                        <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 10 }} onPress={() => this.setState({signature_client_visibility:1})}>
                            <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 20, borderRadius: 20, width: '100%' }}>Signature Client</Text>
                          </TouchableOpacity>
                      </CardView>)
              :
              (<Text style={{display:'none'}}></Text>)
              }


              {
                this.state.list_interventions[0].statut == "affectée" ?
                        this.state.signature_intervenant_visibility > 0 ?
                          (
                            <CardView cardElevation={10} cornerRadius={20} style={styles.SignatureContainer}>
                            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Signature de l'intervenant</Text>
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
                                onPress={() => { alert('Votre signature a bien été validée') }} >
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
                            <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 50 }} onPress={() => alert('Veuillez signer pour terminer l\'intervention')}>
                              <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#999999', padding: 20, borderRadius: 20, width: '100%' }}>Terminer l'intervention</Text>
                            </TouchableOpacity>
                              )
                            }

                            
                          </CardView>


                            
                          )
                          :
                          (
                            <CardView cardElevation={10} cornerRadius={20} style={styles.SignatureContainer}>
                              <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 10 }} onPress={() => this.setState({signature_intervenant_visibility:1})}>
                                  <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 20, borderRadius: 20, width: '100%' }}>Signer et terminer</Text>
                              </TouchableOpacity>
                            </CardView>
                          )
                          :
                          (
                            <TouchableOpacity style={{ alignContent: 'center', margin: 15, marginBottom: 60 }}>
                              <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'gray', padding: 20, borderRadius: 20, width: '100%' }}>L'intervention est déjà terminée</Text>
                            </TouchableOpacity>
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
  SignatureClientContainer:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0, height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    margin: 15,
    backgroundColor: "#BCD0EB",
    borderRadius: 5,
    padding: 5,
    marginBottom:10,
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
