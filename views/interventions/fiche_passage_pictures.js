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
import ImageCompressor from '@trunkrs/react-native-image-compressor';
import SignatureCapture from 'react-native-signature-capture';
const waiting = require('../../resources/images/waiting.png');

class fiche_passage_pictures extends React.Component {

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
      img_c_0: '',
      img_c_1: '',
      img_s_0: '',
      img_s_1: '',
      img_w_0: '',
      img_w_1: '',
      img_a_0: '',
      img_a_1: '',
      token: '',
      Appt: '',
      ref_passage: '',
      data_passage:'',
      cuisine_comment:'',
      salle_de_bain_comment:'',
      wc_comment:'',
      autres_comment:'',
      img_signature:'',
      is_validate:0,
      batiment_name:'',
      nom_occupant:''
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
          const batiment_name = this.props.navigation.getParam('batiment_name', null);

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
            batiment_name:batiment_name
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


check_and_validate(){
    Alert.alert(
      "Voulez-vous vraiment valider sans signature ? ",
      "",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Valider comme meme", onPress: () => this.validate_data(),
  
        }
      ],
      { cancelable: false }
    );
}




async validate_data(){
  return new Promise(async (resolve, reject) => {
            this.state.img_c_0 ? 
            await RNFS.readFile(this.state.img_c_0, 'base64')
            .then(async (res) => {
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 1 Compressed and Saved');
                  this.setState({img_c_0:res});
                });
            })
          : ''

          this.state.img_c_1 ? 
            await RNFS.readFile(this.state.img_c_1, 'base64')
            .then(async (res) => { 
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 2 Compressed and Saved');
                  this.setState({img_c_1:res});
                });
          }) 
          : ''


          this.state.img_s_0 ? 
            await RNFS.readFile(this.state.img_s_0, 'base64')
            .then(async (res) => { 
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 3 Compressed and Saved');
                  this.setState({img_s_0:res});
                });
          }) 
          : ''


          this.state.img_s_1 ? 
            await RNFS.readFile(this.state.img_s_1, 'base64')
            .then(async (res) => { 
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 4 Compressed and Saved');
                  this.setState({img_s_1:res});
                });
          }) 
          : ''


          this.state.img_w_0 ? 
            await RNFS.readFile(this.state.img_w_0, 'base64')
            .then(async (res) => { 
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 5 Compressed and Saved');
                  this.setState({img_w_0:res});
                });
          }) 
          : ''


          this.state.img_w_1 ? 
            await RNFS.readFile(this.state.img_w_1, 'base64')
            .then(async (res) => { 
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 6 Compressed and Saved');
                  this.setState({img_w_1:res});
                });
          }) 
          : ''


          this.state.img_a_0 ? 
            await RNFS.readFile(this.state.img_a_0, 'base64')
            .then(async (res) => { 
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 7 Compressed and Saved');
                  this.setState({img_a_0:res});
                });
          }) 
          : ''


          this.state.img_a_1 ? 
            await RNFS.readFile(this.state.img_a_1, 'base64')
            .then(async (res) => { 
                await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
                .then(async (res) =>{
                  console.log('Image 8 Compressed and Saved');
                  this.setState({ img_a_1:res});
                  this.send_pictures(resolve);
                });
          }) 
          :
          this.send_pictures(resolve);            

      });
  }
  

async send_pictures(resolve){
  console.log('send pictures fucntion');
  const data_pictures = {
    auth_token: this.state.token,
    id_passage: this.state.id_passage,
    cuisine: {
      img_avant:this.state.img_c_0,
      img_apres:this.state.img_c_1,
      cuisine_comment:this.state.cuisine_comment,
    },
    salle_de_bain: {
      img_avant:this.state.img_s_0,
      img_apres:this.state.img_s_1,
      salle_de_bain_comment:this.state.salle_de_bain_comment,
    },
    wc: {
      img_avant:this.state.img_w_0,
      img_apres:this.state.img_w_1,
      wc_comment:this.state.wc_comment,
    },
    autres: {
      img_avant:this.state.img_a_0,
      img_apres:this.state.img_a_1,
      autres_comment:this.state.autres_comment
    },
    signature_occupant : this.state.img_signature,
    nom_occupant: this.state.nom_occupant
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
          this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, id_addresse: this.state.id_addresse, ref_intervention: this.state.ref_intervention,batiment_name:this.state.batiment_name });
          //this.props.navigation.navigate('fiche_passage_titres', { id_passage: this.state.id_passage, ref_passage: this.state.ref_passage + 1, id_logement: this.state.id_logement, id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.Appt})

          resolve("api ok");
          console.log(data_pictures);
        }
      })
      .catch(error => {
        console.log('Rapport pictures non-envoyer, Error : ' + error);
        alert('Rapport pictures non-envoyer');
        resolve("api ok");
      });
}

_onSaveEvent(result) {
  if (result.encoded.length > 2000) {
    console.log('Signature du client enregistrer');
    this.setState({ img_signature: result.encoded,is_validate:1 });
    alert('Signature du client validée');
  } else {
    alert('Veuillez saisir la signature du client');

  }
}


resetSign2() {
  this.refs["sign"].resetImage();
  this.setState({ is_validate: '' });

}


_onDragEvent() {
  console.log("dragged");
}


async validsignature(){
    this.refs["sign"].saveImage();
  
    this.state.img_signature ? 
    await RNFS.readFile(this.state.img_signature, 'base64')
    .then(async (res) => {
        await ImageCompressor.compress(res, {maxWidth: 350,maxHeight: 250})
        .then(async (res) =>{
          console.log('Image 1 Compressed and Saved');
          this.setState({img_signature:res});
        });
    })
  : ''
}

  render() {

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>

        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('fiche_passage', { ref_passage:this.state.ref_passage,id_entervention: this.state.id_entervention, id_passage: this.state.id_passage, id_logement: this.state.id_logement, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.Appt,batiment_name:this.state.batiment_name })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Images du passage</Text>
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
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', width: '100%', margin: 8 }}>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'c_0')} style={{ width: '45%', marginRight: '5%' }}>
                <Text style={this.state.img_c_0 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_c_0 ? 'Image uploadé' : 'Image Avant'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.popup_alert.bind(this, 'c_1')} style={{ width: '45%' }}>
                <Text style={this.state.img_c_1 ? { textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 8, borderRadius: 10, width: '100%'} : {textAlign: 'center', color: '#ffffff', backgroundColor: '#224D88', padding: 8, borderRadius: 10, width: '100%'}}>{this.state.img_c_1 ? 'Image uploadé' : 'Image Après'}</Text>
              </TouchableOpacity>
            </View>


            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Commentaires</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => this.state.cuisine_comment = text} multiline={true}></TextInput>


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
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Commentaires</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => this.state.salle_de_bain_comment = text} multiline={true}></TextInput>
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
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Commentaires</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => this.state.wc_comment = text} multiline={true}></TextInput>
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
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Commentaires</Text>
            <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '100%', height: 100, marginTop: 10, marginBottom: 10 }}
              returnKeyLabel={"next"} onChangeText={(text) => this.state.autres_comment = text} multiline={true}></TextInput>
          </CardView>


        


          
                    <CardView cardElevation={10} cornerRadius={20} style={styles.SignatureContainer}>
                    <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Nom de l'occupant</Text>
                    <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '95%', height: 50, margin: 10, marginBottom: 20 }}
                    returnKeyLabel={"next"} onChangeText={(text) => this.state.nom_occupant = text} multiline={true}></TextInput>
                    <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>Signature de l'occupant</Text>
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
                    <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 10 }} onPress={() => this.validsignature()}>
                        <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'orange', padding: 20, borderRadius: 20, width: '100%' }}>Valider la signature</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signature_buttonStyle}
                              onPress={() => { this.resetSign2() }} >
                              <Text>Supprimer la signature de l'occupant</Text>
                            </TouchableOpacity>
                    </CardView>

          <CardView cardElevation={10} cornerRadius={20} style={styles.BouttonsContainer}>
            <ButtonSpinner style={{ backgroundColor: '#00BFA6', borderRadius: 20, color: '#ffffff' }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }} onPress={this.state.is_validate == 0 ? this.check_and_validate.bind(this) : this.validate_data.bind(this) }>
                <Text style={{ textAlign: 'center', color: '#ffffff', padding: 5, }}>Valider les images et continuer</Text>
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
    margin:10,
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
  SignatureContainer:{
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
    marginBottom: 10,
  }
});


export default fiche_passage_pictures;
