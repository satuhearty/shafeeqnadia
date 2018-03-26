import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import Notifications, {notify} from 'react-notify-toast';
import axios from 'axios';

const MODAL_TIMEOUT = 3000;
const RSVP_CODE = 'shafeeqnadia';

class Rsvp extends Component {
  // componentDidMount() {
  //   this.setState({ showForm: true });
  // }

  state = {
    code: '',
    name: '',
    email: '',
    phone: '',
    attending: 0,
    relationship: '',
    open: false,
    showForm: false,
    formSubmitted: false,
    showGuestList: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const guest = {
      name: this.state.name,
      phone: this.state.phone,
      attending: this.state.attending,
      relationship: this.state.relationship
    };
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
    if (this.state.code === RSVP_CODE) {
      this.createNotification('Success!', 'success');
      this.setState({ showForm: true });
    } else {
      this.createNotification('Incorrect RSVP Code.', 'error');
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

  updateEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  updatePhone = (e) => {
    this.setState({ phone: e.target.value });
  };

  updateAttending = (e) => {
    this.setState({
      attending: e.target.value,
      showGuestList: true
    });
  };

  updateRelationship = (e) => {
    this.setState({ relationship: e.target.value });
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open, attending, showForm, formSubmitted, showGuestList } = this.state;

    const guests = [];
    if (showGuestList) {
      let i;
      for (i = 0; i < attending; i++) {
        guests.push(<Notifications key={i} />);
      }
    }

    return (
      <div>
        <Notifications />
        {!showForm &&
          <div>
            <h2 className="major">RSVP</h2>
            <h3>Please enter the RSVP code.</h3>
            <form className="alt" method="post" action="">
              <div className="field">
                <input type="text" name="code" id="code" placeholder="RSVP Code" onChange={this.updateCode} />
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
                  <select name="attending" id="attending" onChange={this.updateAttending}>
                    <option value=""># of people attending</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
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
