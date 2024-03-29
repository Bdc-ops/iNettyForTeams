import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, BackHandler,Modal,TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ButtonSpinner from 'react-native-button-spinner';
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
      modalVisible: false,
      setModalVisible: false,
      etage_name:'',
      appt_name:'',
      logement_indicator:0,
      batiment_name :''
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 1 });
    this.loadData();
    console.log('--------------------------');
  }

  loadData(){
    AsyncStorage.getItem('user_token')
    .then(token => {
      if (token) {
        const id_entervention = this.props.navigation.getParam('id_entervention', null);
        const ref_intervention = this.props.navigation.getParam('ref_intervention', null);
        const indicator = this.props.navigation.getParam('indicator', null);
        const id_addresse = this.props.navigation.getParam('id_addresse', null);
        const day = this.props.navigation.getParam('day', null);
        const batiment_name = this.props.navigation.getParam('batiment_name', null);
        this.setState({
          day: day,
          id_entervention: id_entervention,
          ref_intervention: ref_intervention,
          indicator: indicator,
          id_addresse: id_addresse,
          batiment_name:batiment_name
        });
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

    console.log('--------------------------');
    console.log('id_entervention :' + this.state.id_entervention);
    console.log('batiment_name :' + this.state.batiment_name);
    console.log('--------------------------');

    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/${id_entervention}/logements/${this.state.batiment_name}`, { auth_token: `${token}` })
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
            console.log(list_logements[index].adresse_id+'----'+id_addresse);
            if (list_logements[index].adresse_id === id_addresse) {
              data.push(list_logements[index]);
            }
          });
          this.setState({ list_logements: data, timer: 0 });
          //console.log(data);
          console.log(`https://inetty.apps-dev.fr/api/mobile/interventions/${id_entervention}/logements/${this.state.batiment_name}`);

        }
        console.log('==============================');
      })
      .catch(async (error) => {
        console.log("ERROR API interventions liste URL : " + error);
        console.log('==============================');
      });
  }

async create_logement(){
  if((this.state.etage_name.length>0) && (this.state.appt_name.length>0)){
    return new Promise(async (resolve, reject) => {
    const logement_data = {
      auth_token: this.state.token,
      building_id : this.state.list_logements[0].building_id,
      etage_name:this.state.etage_name,
      appt_name:this.state.appt_name,
      int_id:this.state.id_entervention
    }
   
      await axios(
        {
          method: 'post',
          url: `https://inetty.apps-dev.fr/api/mobile/interventions/create_logements`,
          headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
          data: logement_data
        }
      )
        .then(async (response) => {
          console.log('reponse : ' + response.status);
          if (response.status === 200) {
            console.log('Logement created, response : ' + response.status);
            resolve("api ok");
            this.setState({logement_indicator:1})
            this.loadData();
            //this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.ref_intervention });
  
          }
        })
        .catch(error => {
          console.log('Logement creation error, Error : ' + error);
          resolve("api ok");
  
        });
      });
  }else{
    alert('Veuillez saisir les informations du nouveau logement!')
  }

}


  render() {

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('list_batiments', { id_entervention: this.state.id_entervention, indicator: 'interventions', day: '',ref_intervention:this.state.ref_intervention,id_addresse:this.state.id_addresse,batiment_name:this.state.batiment_name })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Bâtiment</Text>
          <Text style={{ color: "#ffffff", backgroundColor: '#224D88', padding: 5, borderRadius: 10, borderStyle: 'solid', position: 'absolute', right: 10, fontSize: 15, fontWeight: 'bold' }}>{this.state.batiment_name ? this.state.batiment_name : '---'}</Text>
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
              (
                <Text></Text>
                  /*<TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 10}} onPress={() => { this.setState({ modalVisible: true }) }}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 20, borderRadius: 20, width: '100%' }}>Ajouter un logement</Text>
                  </TouchableOpacity>  */            
            )
          }


          <Modal animationType="slide" transparent={true} visible={this.state.modalVisible}>
            <View style={styles.modal_create_logement}>
              <View style={styles.modal_view}>
              <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 20, textDecorationLine: 'underline' }}>Nouveau logement</Text>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View style={{ flexDirection: 'column', width: '40%' }}>
                      <Text style={{ margin: 10, marginBottom: 20, fontSize: 20 }}>Etage</Text>
                      <Text style={{ margin: 10, marginBottom: 20, fontSize: 20 }}>Appt</Text>
                  </View>
                  <View style={{ flexDirection: 'column', width: '60%' }}>
                      <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20 }}
                          returnKeyLabel={"next"} onChangeText={(text) => this.setState({etage_name : text})}></TextInput>

                      <TextInput style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                          returnKeyLabel={"next"} onChangeText={(text) => this.setState({appt_name : text})}></TextInput>
                  </View>
                </View>
                {
                  this.state.logement_indicator == 0 ?
                  (
                <ButtonSpinner style={{ alignContent: 'center', marginTop: 30,width:'100%', backgroundColor: '#00BFA6', borderRadius: 20, padding: 10 }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }} onPress={() => this.create_logement()}>
                      <Text style={{ textAlign: 'center', color: '#ffffff' }}>Enregistrer</Text>
                </ButtonSpinner>
                  )
                  :
                  (
                    <ButtonSpinner style={{ alignContent: 'center', marginTop: 30,width:'100%', backgroundColor: 'gray', borderRadius: 20, padding: 10 }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }}>
                      <Text style={{ textAlign: 'center', color: '#ffffff' }}>Logement ajouté</Text>
                </ButtonSpinner>
                  )
                }
                
                <TouchableOpacity style={{ alignContent: 'center',width:35,height:30,position:'absolute',top:5,right:5 }} onPress={() => this.setState({ modalVisible: false,logement_indicator:0 })}>
                      <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: 'red', padding: 8, borderRadius: 20, width: '100%' }}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
            </Modal>


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
                this.state.list_logements[index].status == "absent" ?

                (
                  <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('list_passages', { id_logement: this.state.list_logements[index].id, id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.list_logements[index].appart_num,batiment_name:this.state.batiment_name })}>
                    <View style={styles.intContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', width: 210 }} numberOfLines={1}>Etage {this.state.list_logements[index].etage_num} - Appt {this.state.list_logements[index].appart_num}</Text>
                        <Text style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: 'gray', padding: 5, borderRadius: 10 }}>Absent</Text>

                      </View>
                    </View>
                  </TouchableOpacity>
                )
                :
                this.state.list_logements[index].status == "pending" ?
                  (
                    <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('list_passages', { id_logement: this.state.list_logements[index].id, id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.list_logements[index].appart_num,batiment_name:this.state.batiment_name })}>
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
                      <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('list_passages', { id_logement: this.state.list_logements[index].id, id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse, appt: this.state.list_logements[index].appart_num,batiment_name:this.state.batiment_name })}>
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
  modal_create_logement:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'rgba(34, 77, 136,0.7)'
  },
  buttons_view:{
    flexDirection: 'row'
  },
  modal_view:{
    width: '80%',
    height: 300,
    margin: 20,
    borderRadius: 25,
    padding: 35,
    shadowColor: "#F2784B",
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    opacity:1,
    zIndex:100,
    elevation:20

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
