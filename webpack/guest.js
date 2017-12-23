import React, { Component } from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase';
import config from './components/firebase-config';
import Main from './components/Main';
import Rsvp from './components/Rsvp';

firebase.initializeApp(config);

class Guestbook extends Component {
  render() {
    return (
      <Main firebase={firebase} />
    )
  }
}

class RsvpPage extends Component {
  render() {
    return (
      <Rsvp firebase={firebase} />
    )
  }
}

render(<Guestbook />, document.getElementById('guestbook'));
render(<RsvpPage />, document.getElementById('rsvp-page'));
