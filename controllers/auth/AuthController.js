
import { LOGIN_ATTEMPT, LOGIN_SUCCESS, LOGIN_FAILED } from './types_attempt';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export const auth = ({ username, password }) => {


    return async (dispatch) => {
        dispatch({ type: LOGIN_ATTEMPT });
        //###################################################
        // get infos from Extern auth API
        //###################################################

        await axios.post(`https://inetty.apps-dev.fr/api/mobile/intervenants/login`, { id: `${username}`, auth_pswd: `${password}` })
            .then(async (response) => {
                console.log('==============================');
                console.log('DB URL : ' + `https://inetty.apps-dev.fr/api/mobile/intervenants/login`);
                console.log('Reponse URL status : ' + response.status);
                console.log('Reponse API status : ' + response.data.success);
                if (response.data.success == true) {
                    console.log('Authentification Correct');
                    console.log(response.data.auth_token);
                    onLoginSuccess(dispatch, response.data.auth_token, username)
                } else {
                    console.log('Authentification Error');
                    console.log(response.data.success);
                    console.log(response.data.reason);
                    onLoginFailed(dispatch, "Vos informations d'authentification sont incorrect")
                }
                console.log('==============================');

            })
            .catch(async (error) => {
                onLoginFailed(dispatch, "Vos informations d'authentification sont incorrect")
                console.log("ERROR API Connection URL : " + error);
                console.log('==============================');
            });
    };
}


const onLoginSuccess = (dispatch, token, username) => {
    AsyncStorage.setItem('user_token', token)
        .then(() => {
            AsyncStorage.setItem('username', username);
            dispatch({ type: LOGIN_SUCCESS, token: token });
        })
        .catch(error => onLoginFailed(dispatch, "Vos informations d'authentification sont incorrect"));
};

const onLoginFailed = (dispatch, errorMessage) => {
    dispatch({ type: LOGIN_FAILED, error: errorMessage });
};


