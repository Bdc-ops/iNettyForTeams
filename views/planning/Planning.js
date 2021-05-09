import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import FooterView from '../static_component/FooterView'
import LinearGradient from 'react-native-linear-gradient';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';


LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';



class Planning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list_planning: [],
      timer: 1,
    };
  }

  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    this.setState({ timer: 1 });
    AsyncStorage.getItem('user_token')
      .then(token => {
        const { navigate } = this.props.navigation;
        if (token) {
          this.Get_list_planning(token);
        } else {
          //navigate('error');
        }
      });
  }

  componentWillUnmount() {
    this.handler.remove()
    BackHandler.addEventListener('hardwareBackPress', () => { return false })
  }

  async Get_list_planning(token) {
    await axios.post(`https://inetty.apps-dev.fr/api/mobile/interventions/weekly/list`, { auth_token: `${token}` })
      .then(async (response) => {
        console.log('==============================');
        console.log('Planning');
        console.log('Reponse API status : ' + response.status);
        if (response.data.success == true) {
          console.log('List correctly mapped');
          let list_planning = response.data.ents_list;
          var data = [];
          await Object.keys(list_planning).forEach(async function (index) {
            data.push(list_planning[index].date_du);
          });
          this.setState({ list_planning: data, timer: 0 });
          //console.log(obj);
        }
        console.log('==============================');
      })
      .catch(async (error) => {
        console.log("ERROR API interventions liste URL : " + error);
        console.log('==============================');
      });
  }

  render() {
    var obj = this.state.list_planning.reduce((c, v) => Object.assign(c, { [v]: { selected: true, marked: true } }), {});

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>

        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#BCD0EB', '#BCD0EB', '#BCD0EB', '#BCD0EB']} style={styles.header}>
          <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.props.navigation.navigate('Dashboard')} >
            <Image style={{ width: 35, height: 35 }} source={require('../../resources/images/back.png')} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', left: 60, fontSize: 16, fontWeight: 'bold', color: "#224D88" }}>Calendrier</Text>
        </LinearGradient>

        <View style={styles.body}>

          <Calendar

            // Collection of dates that have to be marked. Default = {}
            markedDates={obj}
            onDayPress={(day) => { this.props.navigation.navigate('List_plannings', { plannings_day: day.dateString, indicator: 'planning' }) }}
            enableSwipeMonths={true}
            scrollEnabled={true}
          />


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

export default Planning;
