import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ContentRoute from '../../containers/ContentRoute/ContentRoute';
import { NavBar } from '../../containers/NavBar/NavBar';
import Welcome from '../../containers/Welcome/Welcome';
import * as userActions from '../../actions/userAction';
import { stravaApi } from '../../data/strava_config';
import './App.css';
export class App extends Component {
  constructor() {
    super();
    this.state = {
      code: '',
      showHistory: false,
      data: null
    };
  }

  componentDidMount() {
    const { search } = window.location;
    const codeIndex = search.indexOf('code') + 5;
    const lastIndex = search.lastIndexOf('&');
    if (search.includes('code')) {
      this.setState({ code: search.slice(codeIndex, lastIndex) });
    }
    if (localStorage.getItem('code')) {
      const codeValue = JSON.parse(localStorage.getItem('code'));
      const refreshUrl = `http://localhost:3000/?state=&code=${codeValue}&scope=`;

      window.location.reload(refreshUrl);
      localStorage.removeItem('code');
    }

    this.callBackendApi()
      .then(response => this.setState({ data: response.express }))
      .catch(error => {});
  }

  handleClick = () => {
    const url = `https://www.strava.com/oauth/authorize?client_id=${
      stravaApi.client_id
    }&redirect_uri=${
      stravaApi.redirect_uri
    }&response_type=code&approval_prompt=force`;
    window.location = url;
  };

  callBackendApi = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  signOutUser = () => {
    localStorage.removeItem('code');
    window.location = 'http://localhost:3000/';
  };

  render() {
    const { code } = this.state;
    const stravant = 'S†ra√an†';

    return (
      <BrowserRouter>
        <div className="App">
          <p>{this.state.data}</p>
          <span className="header">
            <h1 className="welcome-title">{stravant}</h1>
            <i className="fas fa-sign-in-alt" onClick={this.signOutUser} />
          </span>
          {code && <NavBar />}
          {code && <Welcome />}
          {code && <ContentRoute />}
          {window.location.search.length < 16 && (
            <span className="logos">
              <div className="spinning-globe">Credits to Nick</div>
              <img
                src={require('../../images/connect-logo.png')}
                height="75"
                width="250"
                className="connect-logo"
                onClick={this.handleClick}
              />
            </span>
          )}
          <div className="required-logo">
            <img
              src={require('../../images/powered-by-strava.png')}
              height="40"
              width="150"
              className="strava-powered"
            />
            <i class="fab fa-strava" />

            <img
              src={require('../../images/turing-logo.png')}
              height="70"
              width="70"
              className="strava-powered"
            />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export const mapStateToProps = state => ({
  currentUser: state.currentUser
});

export const mapDispatchToProps = dispatch => ({
  setAccessToken: token => dispatch(userActions.setAccessToken(token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
