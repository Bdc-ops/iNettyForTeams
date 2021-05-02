import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const IMG_SRC = require('../../resources/images/bg.jpg');
const LOGO = require('../../resources/images/logo.png');


class Home extends React.Component {


  componentDidMount() {
    AsyncStorage.getItem('user_token')
      .then(token => {
        setTimeout(() => {
          const { navigate } = this.props.navigation;
          if (token) {
            navigate('Dashboard');
          } else {
            navigate('Login');
          }
        }, 2500);
      });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <Image source={IMG_SRC} resizeMode='cover' style={styles.backdrop} />
        </View>
        <Image style={styles.logo} source={LOGO} />
      </View>
    );
  }
};
var styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 300,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdrop: {
    flex: 1,
    flexDirection: 'column'
  }
});


export default Home;
