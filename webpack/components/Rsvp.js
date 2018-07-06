import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import Notifications, {notify} from 'react-notify-toast';
import axios from 'axios';

const MODAL_TIMEOUT = 3000;
const RSVP_CODE = 'smsknf';

class Rsvp extends Component {

  state = {
    code: '',
    name: '',
    phone: '',
    attending: 0,
    relationship: '',
    nadiaDisabled: true,
    nadia: false,
    shafeeq: false,
    open: false,
    showForm: false,
    formSubmitted: false,
    attendingArray: [],
    extraGuests: []
  };

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { name, phone, nadia, shafeeq, relationship, attending, extraGuests } = this.state;

    if (name === '') {
      this.createNotification('Please enter your name.', 'error');
      return;
    } else if (phone === '') {
      this.createNotification('Please enter your phone number.', 'error');
      return;
    } else if (relationship === '') {
      this.createNotification('Please select a relation.', 'error');
      return;
    } else if (attending === 1) {
      this.createNotification('Please select the number of guests that are attending.', 'error');
      return;
    } else if (attending > 1 && extraGuests.length !== attending - 1) {
      this.createNotification('Please enter guest names.', 'error');
      return;
    } else if (nadia === false && shafeeq === false) {
      this.createNotification('Please select at least 1 event.', 'error');
      return;
    }

    const guest = { name, phone, relationship, attending, extraGuests, nadia, shafeeq };
    this.props.firebase.database().ref('rsvp').push(guest);
    axios.post('https://formspree.io/nikamirulmukmeen@gmail.com', guest);
    this.onOpenModal();
    setTimeout(() => {
      this.onCloseModal();
    }, MODAL_TIMEOUT);
    this.setState({ formSubmitted: true });
  };

  handleCodeSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { nadia, shafeeq, code } = this.state;
    if (nadia === false && shafeeq === false) {
      this.createNotification('Please select at least one invitation.', 'error');
    } else if (nadia === true && code !== RSVP_CODE) {
      this.createNotification('Incorrect RSVP Code.', 'error');
    } else {
      this.createNotification('Success!', 'success');
      this.setState({ showForm: true });
    }
  };

  createNotification = (message, type) => {
    notify.show(message, type, MODAL_TIMEOUT);
  };

  updateCode = (e) => {
    this.setState({ code: e.target.value });
  };

  updateName = (e) => {
    this.setState({ name: e.target.value });
  };

  updatePhone = (e) => {
    this.setState({ phone: e.target.value });
  };

  updateRelationship = (e) => {
    this.setState({ relationship: e.target.value });
  };

  updateAttending = (e) => {
    this.setState({
      attending: e.target.value,
      attendingArray: Array(e.target.value - 1).fill(1)
    });
  };

  updateGuests = (e) => {
    const extraGuests = this.state.extraGuests;
    const guestIndex = e.target.dataset.guestIndex;
    extraGuests[guestIndex] = e.target.value;
    this.setState({ extraGuests: extraGuests });
  };

  updateNadia = () => {
    if (this.state.nadiaDisabled === true) {
      this.setState({ nadiaDisabled: false })
    }
    this.setState({ nadia: !this.state.nadia });
  };

  updateShafeeq = () => {
    this.setState({ shafeeq: !this.state.shafeeq });
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open, nadia, shafeeq, attending, showForm, formSubmitted, attendingArray, nadiaDisabled } = this.state;

    return (
      <div>
        <Notifications />
        {!showForm &&
          <div>
            <h2 className="major">RSVP</h2>
            <form className="alt" method="post" action="">
              <div className="field">
                <input type="checkbox" id="nadia" name="nadia" checked={nadia} onChange={this.updateNadia} />
                <label htmlFor="nadia">Nadia' Side - Saturday, 4 August 2018, 7.30-10.30pm</label>
              </div>
              <div className="field">
                <input type="text" name="code" id="code" placeholder="RSVP Code for Nadia' Side" onChange={this.updateCode} />
              </div>
              <div className="field">
                <input type="checkbox" id="shafeeq" name="shafeeq" checked={shafeeq} onChange={this.updateShafeeq} />
                <label htmlFor="shafeeq">Shafeeq's Side - Saturday, 21 July 2018, 11.30am-4pm</label>
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <input type="submit" value="Submit" className="special" onClick={this.handleCodeSubmit} />
              </div>
            </form>
          </div>
        }
        {showForm &&
          <div>
            <h2 className="major">RSVP</h2>
            <h3>Let us know if you are coming!</h3>
            <form method="post" action="">
              <div className="field half first">
                <label htmlFor="name">Name *</label>
                <input type="text" name="name" id="name" placeholder="" onChange={this.updateName} />
              </div>
              <div className="field half">
                <label htmlFor="phone">Phone *</label>
                <input type="text" name="phone" id="phone" placeholder="" onChange={this.updatePhone} />
              </div>
              <div className="field half first">
                <label htmlFor="attending">Attending *</label>
                <div className="select-wrapper">
                  <select name="attending" id="attending" defaultValue="0" onChange={this.updateAttending}>
                    <option value="0" disabled># of people attending</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
              <div className="field half">
                <label htmlFor="relationship">Relationship *</label>
                <div className="select-wrapper">
                  <select name="relationship" id="relationship" onChange={this.updateRelationship}>
                    <option value="">-</option>
                    <option value="orion">ORION 0509</option>
                    <option value="ssp">SSP</option>
                    <option value="uniten">UNITEN</option>
                    <option value="drake">Drake</option>
                    <option value="bioeconomy">Bioeconomy Corporation</option>
                  </select>
                </div>
              </div>
              {attendingArray.map((x, i) => {
                return (
                  <div className="field" key={i}>
                    <input
                      type="text"
                      name={`guest-${i}`}
                      placeholder={`Guest ${i + 1} Name *`}
                      data-guest-index={i}
                      onChange={this.updateGuests}
                    />
                  </div>
                )
              })}
              <h3>I will be attending:</h3>
              <div className="field">
                <input type="checkbox" id="nadia" name="nadia" checked={nadia} onChange={this.updateNadia} disabled={nadiaDisabled} />
                <label htmlFor="nadia">Nadia' Side - Saturday, 4 August 2018, 7.30-10.30pm</label>
              </div>
              <div className="field">
                <input type="checkbox" id="shafeeq" name="shafeeq" checked={shafeeq} onChange={this.updateShafeeq} />
                <label htmlFor="shafeeq">Shafeeq's Side - Saturday, 28 July 2018, 6-11pm</label>
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <input type="submit" value="RSVP" className="special" onClick={this.handleSubmit} disabled={formSubmitted} />
              </div>
            </form>
            <Modal
              open={open}
              onClose={this.onCloseModal}
              little
              classNames={{ overlay: 'custom-overlay', modal: 'custom-modal', closeIcon: 'custom-close' }}
            >
              <div style={{ textAlign: 'center', padding: '25px 15px' }}>
                <h2>RSVP sent successfully!</h2>
                <p style={{ textAlign: 'center', margin: 0 }}>{attending} people attending.</p>
              </div>
            </Modal>
          </div>
          }
        </div>
    )
  }
}

export default Rsvp;
