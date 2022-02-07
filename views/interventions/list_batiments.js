import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, BackHandler,Modal,TextInput,Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ButtonSpinner from 'react-native-button-spinner';
import FooterView from '../static_component/FooterView'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const waiting = require('../../resources/images/waiting.png');
const buildings = require('../../resources/images/buildings.png');

class list_batiments extends React.Component {

  constructor(props) {
    super(props);
    this.batiment_name = React.createRef();
    this.etage_name = React.createRef();
    this.appt_name = React.createRef();
    this.state = {
      day: '',
      id_entervention: '',
      ref_intervention: '',
      indicator: '',
      id_addresse: '',
      list_batiments: [],
      timer: 1,
      modalVisible: false,
      setModalVisible: false,
      batiment_name:'',
      etage_name:'',
      appt_name:'',
      logement_indicator:0,
      token:''
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 1 });
    this.loadData();
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
        this.setState({
          day: day,
          id_entervention: id_entervention,
          ref_intervention: ref_intervention,
          indicator: indicator,
          id_addresse: id_addresse,
          token:token
        });
        console.log('inter :' + id_entervention);

        this.Get_details_batiments(token, id_entervention, id_addresse);

      } else {
        //navigate('error');
      }
    });
  }

  componentWillUnmount() {
    this.handler.remove()
    BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }


  async Get_details_batiments(token, id_entervention, id_addresse) {

    console.log('de l\'intervention' + id_entervention);
    console.log('de l\'adresse' + id_addresse);

    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/${id_entervention}/batiments/${id_addresse}`, { auth_token: `${token}` })
      .then(async (response) => {
        console.log('==============================');
        console.log('Liste des logements');
        console.log('Reponse API status : ' + response.status);
        if (response.data.success == true) {
          console.log('msg success' + response.data.success);
          console.log('List correctly mapped');
          let list_batiments = response.data.batiments;
          var data = [];
          await Object.keys(list_batiments, id_entervention, id_addresse).forEach(async function (index) {
              data.push(list_batiments[index]);
              /*
              if (list_batiments[index].adresse_id === id_addresse) {
              data.push(list_logements[index]);
            }
              */
          });
          this.setState({ list_batiments: data, timer: 0 });

          console.log(data);
          console.log('id_addresse : '+this.state.id_addresse);

        }
        console.log('==============================');
      })
      .catch(async (error) => {
        console.log("ERROR API interventions liste URL : " + error);
        console.log('==============================');
      });
  }

async create_batiment(){
  if(this.state.batiment_name.length>0){
    return new Promise(async (resolve, reject) => {
    const batiment_data = {
      auth_token: this.state.token,
      int_id : this.state.id_entervention,
      addr_id : this.state.id_addresse,
      name:this.state.batiment_name,
      etage_name:this.state.etage_name,
      appt_name:this.state.appt_name
    }
    console.log(batiment_data);

      await axios(
        {
          method: 'post',
          url: `https://inetty.apps-dev.fr/api/mobile/interventions/create_batiment`,
          headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
          data: batiment_data
        }
      )
        .then(async (response) => {
          console.log('reponse : ' + response.status);
          if (response.status === 200) {
            console.log('Logement created, response : ' + response.status);
            resolve("api ok");
            this.setState({logement_indicator:1,/*modalVisible: false*/})
            this.loadData();
            //this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.ref_intervention });
            setTimeout(() => {
              this.setState({logement_indicator:0,batiment_name:'',etage_name:'',appt_name:''})
              this.batiment_name.current.clear();
              this.etage_name.current.clear();
              this.appt_name.current.clear();
            },1500);
          }
        })
        .catch(error => {
          console.log('Logement creation error, Error : ' + error);
          console.log(batiment_data);
          resolve("api ok");
  
        });
      });
  }else{
    alert('Veuillez saisir les informations du nouveau logement!')
  }

}

delete_batiment_alert(addr_id,name){
  Alert.alert(
    "Voulez-vous vraiment supprimer tout le bâtiment ?",
    "",
    [
      {
        text: "Annuler",
        style: "cancel"
      },
      {
        text: "Confirmer", onPress: () => this.delete_batiment(addr_id,name)
      }
    ],
    { cancelable: false }
  );
}

async delete_batiment(addr_id,name){
  console.log("delete batiment : "+addr_id+'-'+name);
  const batiment_data = {
    auth_token: this.state.token,
    addr_id : addr_id,
    name : name
  }
    await axios(
      {
        method: 'post',
        url: `https://inetty.apps-dev.fr/api/mobile/interventions/${this.state.id_entervention}/delete/logements`,
        headers: { 'auth_token': this.state.token, 'Accept': 'application/json' },
        data: batiment_data
      }
    )
      .then(async (response) => {
        console.log('reponse : ' + response.status);
        if (response.status === 200) {
          console.log('batiment deleted, response : ' + response.status);
          this.loadData();
        }
      })
      .catch(async (error) => {
        console.log('Batiment suppression error, Error : ' + error);
      });
}
  render() {

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('fiche_intervention', { id_entervention: this.state.id_entervention, indicator: 'interventions', day: '' })} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Intervention</Text>
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
              (
                  <TouchableOpacity style={{ alignContent: 'center', margin: 10, marginBottom: 10}} onPress={() => { this.setState({ modalVisible: true }) }}>
                    <Text style={{ textAlign: 'center', color: '#ffffff', backgroundColor: '#00BFA6', padding: 20, borderRadius: 20, width: '100%' }}>Ajouter un bâtiment</Text>
                  </TouchableOpacity>              
            )
          }


          <Modal animationType="slide" transparent={true} visible={this.state.modalVisible}>
            <View style={styles.modal_create_logement}>
              <View style={styles.modal_view}>
              <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', marginBottom: 20, textDecorationLine: 'underline' }}>Nouveau bâtiment</Text>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View style={{ flexDirection: 'column', width: '40%' }}>
                      <Text style={{ margin: 10, marginBottom: 30, fontSize: 15 }}>Batiment </Text>
                      <Text style={{ margin: 10, marginBottom: 30, fontSize: 15 }}>Etage</Text>
                      <Text style={{ margin: 10, marginBottom: 30, fontSize: 15 }}>Appt</Text>
                  </View>
                  <View style={{ flexDirection: 'column', width: '60%' }}>
                      <TextInput ref={this.batiment_name}  style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20 }}
                          returnKeyLabel={"next"} onChangeText={(text) => this.setState({batiment_name : text})}></TextInput>

                      <TextInput ref={this.etage_name}  style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                          returnKeyLabel={"next"} onChangeText={(text) => this.setState({etage_name : text})}></TextInput>

                      <TextInput ref={this.appt_name}  style={{ borderColor: 'gray', borderStyle: 'solid', borderWidth: 1, width: '90%', fontSize: 20, marginTop: 10 }}
                          returnKeyLabel={"next"} onChangeText={(text) => this.setState({appt_name : text})}></TextInput>

                  </View>
                </View>
                {
                  this.state.logement_indicator == 0 ?
                  (
                <ButtonSpinner style={{ alignContent: 'center', marginTop: 30,width:'100%', backgroundColor: '#00BFA6', borderRadius: 20, padding: 10 }} positionSpinner={'centered-without-text'} styleSpinner={{ color: '#ffffff' }} onPress={() => this.create_batiment()}>
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


          {this.state.list_batiments.length > 0 ?
            this.state.list_batiments.map((detail, index) =>
                  (
                   

                    <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('list_logements', { id_entervention: this.state.id_entervention, ref_intervention: this.state.ref_intervention, id_addresse: this.state.id_addresse,batiment_name: detail.name})}>
                    <View style={styles.intContainer}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                        <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', width: 210 }} numberOfLines={1}>Bâtiment : {detail.name}</Text>
                        <Text onPress={() => this.delete_batiment_alert(this.state.id_addresse,detail.name)} style={{ position: 'absolute', right: 0, color: '#ffffff', backgroundColor: 'red', paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20, borderRadius: 100 }}>X</Text>

                      </View>
                    </View>
                  </TouchableOpacity>)
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
    height: 350,
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


export default list_batiments;
