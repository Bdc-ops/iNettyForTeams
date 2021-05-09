import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import FooterView from '../static_component/FooterView'
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import CardView from 'react-native-cardview';
const team = require('../../resources/images/team.png');
const disconnect = require('../../resources/images/disconnect.png');

class Configurations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    AsyncStorage.getItem('username')
      .then(username => {
        if (username) {
          this.setState({ username: username })
        }
      });
  }

  componentWillUnmount() {
    this.handler.remove()
    BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }

  _logout() {
    console.log('logout');
    Alert.alert(
      "IMPORTANT",
      "Voulez-vous vraiment se déconnecter de l'application .",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Confirmer", onPress: () => this._logout_action()
        }
      ],
      { cancelable: false }
    );
  }


  _logout_action() {
    AsyncStorage.removeItem('user_token')
      .then(result => {
        AsyncStorage.removeItem('username')
          .then(result => {
            BackHandler.exitApp();
          });
      });


  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('Dashboard')} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
        </LinearGradient>


        <View style={styles.configContainer}>
          <Image style={{ width: 250, height: 200 }} source={team}></Image>
          <Text style={styles.username_text}>Utilisateur connecté : {this.state.username}</Text>

          <TouchableOpacity style={{ alignItems: 'flex-end', position: 'absolute', right: '44%', bottom: -5, width: 30, height: 30, zIndex: 100 }} onPress={() => {
            this._logout()
          }}>
            <Image style={{ width: 50, height: 50 }} source={disconnect}></Image>
          </TouchableOpacity>

        </View>


        <View style={styles.body}>
          <CardView cardElevation={10} cornerRadius={20} style={styles.aboutContainer}>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 20, textDecorationLine: 'underline' }}>A propos</Text>
            <Text style={{ fontSize: 15, color: "#000000", marginLeft: 20, marginBottom: 20, width: '90%' }}>
            iNetty est une suite de solutions 100% digitales qui remplace les processus classiques par des processus dématérialisés.
            Notre solution vous accompagne depuis la planification jusqu’à la réalisation de vos interventions sur le terrain et optimise la remontée et le traitement de vos informations.
              </Text>
            <Text style={{ fontSize: 20, color: "#224D88", fontWeight: 'bold', margin: 20, textDecorationLine: 'underline' }}>Contact</Text>
            <View style={{ fontSize: 15, color: "#000000", marginLeft: 20, marginBottom: 20, width: '90%', flexDirection: 'column' }}>
              <Text>Https://bigdataconsulting.fr</Text>
              <Text>Commercial@anexys.fr</Text>
              <Text>+33 1 77 62 46 89</Text>
              <Text>17/19 Bd de la Muette, 95140 Garges les Gonesse, France.</Text>
            </View>

          </CardView>



        </View>





        <FooterView />
      </ScrollView>
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
    borderRadius: 30,
    margin: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',

  },

  configContainer: {
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
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25
  },

  aboutContainer: {
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
    marginBottom: 65,
    marginTop: 30,
    backgroundColor: '#ffffff',
    borderRadius: 25
  },
  username_text: {
    fontSize: 15,
    color: "#224D88",
    fontWeight: 'bold',
    marginBottom: 30
  },
  TextStyle: {
    color: '#000000',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
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


});

export default Configurations;
