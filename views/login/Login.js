import React from 'react';
import { StyleSheet, View, Button, Image, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';
import FooterView from '../static_component/FooterView';
import { Spinner } from '../static_component/Spinner';
import { auth } from '../../controllers/auth';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

const IMG1 = require('../../resources/images/logo.png');
const frame = require('../../resources/images/frame.png');



class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user_token: '',
      username: '',
      password: '',
    };
  }

  static getDerivedStateFromProps(props, state) {

    if (props.token) {
      const { navigate } = props.navigation;

      AsyncStorage.getItem('user_token')
        .then(token => {
          if (token) {
            console.log('token user:' + token);
            navigate('Dashboard');
          }
        })

      return { path: props.path };
    }
    else return null;
  }


  _OnLoginPressed() {
    const { username, password } = this.state;
    console.log('******************************');
    console.log('****   Authentification   ****');
    console.log('******************************');
    console.log('Username : ' + username);
    console.log('Password : ' + password);
    console.log('==============================');
    this.props.auth({ username, password });
    /*this.srv_name.clear();
    this.username.clear();
    this.password.clear();*/
  }

  _renderButton() {
    if (this.props.loading) {
      return <Spinner style={styles.spinner} />;
    } else {
      return (
        <TouchableOpacity onPress={this._OnLoginPressed.bind(this)} style={styles.SubmitButtonStyle} activeOpacity={.5}>
          <Text style={styles.TextStyle}>Authentification</Text>
        </TouchableOpacity>
      );
    }

  }


  render() {
    return (
      <ScrollView contentContainerStyle={styles.containerMain} >
        <View style={styles.container}  >
          <Image style={styles.frame} source={frame} resizeMode="contain" resizeMethod="resize" />

          <Image style={styles.auth} source={IMG1} />

          <TextInput ref={input => { this.username = input }} placeholder="Nom d'utilisateur" style={styles.inputs} returnKeyLabel={"next"}
            onChangeText={(text) => this.setState({ username: text })} autoCapitalize='none' />

          <TextInput ref={input => { this.password = input }} placeholder="Mot de passe" style={styles.inputs} secureTextEntry={true} returnKeyLabel={"next"}
            onChangeText={(text) => this.setState({ password: text })} autoCapitalize='none' />

          {this._renderButton()}

          <Text style={styles.error_msg}>{this.props.error}</Text>

        </View>
        <View style={styles.rad}></View>
        <FooterView />
      </ScrollView>
    );
  }
};
const mapStatetoPropos = state => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    token: state.auth.token,
  }
}

export default connect(mapStatetoPropos, { auth })(Login);

//export default Login;



const styles = StyleSheet.create({
  containerMain: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',

  },
  container: {
    marginTop: 20,
    marginBottom: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  frame: {
    width: 190,
    position: 'absolute',
    right: 0,
    opacity: 0.2,
  },
  auth: {
    width: 300,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 45,
    marginTop: 45,
  },
  inputs: {
    width: 300,
    height: 40,
    borderColor: '#224D88',
    borderWidth: 1,
    borderRadius: 25,
    textAlign: 'center',
    color: '#224D88',
    marginBottom: 5,
    backgroundColor: '#ffffff'

  },
  spinner: {
    margin: 35,
    padding: 35,
  },
  error_msg: {
    color: 'red',
    marginTop: 20,
  },
  SubmitButtonStyle: {
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#224D88',
    borderRadius: 25,
    width: 300,
  },
  WaitingButtonStyle: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    width: 300,
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
});

