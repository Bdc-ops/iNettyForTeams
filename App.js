import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer, createSwitchNavigator, } from 'react-navigation';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers'
import ReduxThunk from 'redux-thunk';
import Home from './views/splash/Home';
import Dashboard from './views/dashboard/Dashboard';
import Login from './views/login/Login';
import DayInterventions from './views/interventions/DayInterventions';
import fiche_intervention from './views/interventions/fiche_intervention';
import Planning from './views/planning/Planning';
import List_plannings from './views/planning/List_plannings'
import list_interventions from './views/interventions/list_interventions';
import Configurations from './views/configuration/Configurations';
import list_batiments  from './views/interventions/list_batiments'
import list_logements from './views/interventions/list_logements';
import list_passages from './views/interventions/list_passages';
import fiche_passage from './views/interventions/fiche_passage';
import fiche_passage_pictures from './views/interventions/fiche_passage_pictures';
import fiche_passage_titres from './views/interventions/fiche_passage_titres';

global.connected = true


const Stack = createStackNavigator();


export default class App extends React.Component {
  render() {

    const Navigation = createAppContainer(createSwitchNavigator(
      {
        Splash: Home,
        Login: Login,
        Dashboard: Dashboard,
        DayInterventions: DayInterventions,
        fiche_intervention: fiche_intervention,
        Planning: Planning,
        List_plannings: List_plannings,
        list_interventions: list_interventions,
        Configurations: Configurations,
        list_batiments:list_batiments,
        list_logements: list_logements,
        list_passages: list_passages,
        fiche_passage: fiche_passage,
        fiche_passage_pictures: fiche_passage_pictures,
        fiche_passage_titres:fiche_passage_titres,
      },
      {
        initialRouteName: 'Splash',
      }
    ));

    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <Navigation />
      </Provider>
    );
  }

}