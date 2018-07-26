import React, { Component } from 'react';
import {render} from 'react-dom';
import * as firebase from 'firebase';
import config from './components/firebase-config';
import ReactTable from 'react-table';
import Modal from 'react-responsive-modal';

const MIN_WIDTH_FOR_RSVP_DETAILS = 50;

class App extends Component {
  constructor() {
    super();
    firebase.initializeApp(config);
  }

  state = {
    data: [],
    open: false,
    currentData: {}
  };

  componentDidMount() {
    this.getGuestList();
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  getGuestRsvpData = (rsvp) => {
    return rsvp
      ? <i className="fa fa-check" aria-hidden="true" style={{color: 'green'}} />
      : <i className="fa fa-times" aria-hidden="true" style={{color: 'red'}} />
  };

  getGuestList = () => {
    firebase.database().ref('rsvp').on('value', snapshot => {
      const guestList = [];
      const guests = snapshot.val();
      Object.keys(guests).forEach((key) => {
        guestList.push({
          'name': guests[key].name,
          'email': guests[key].email,
          'phone': guests[key].phone,
          'nadia': guests[key].nadia,
          'shafeeq': guests[key].shafeeq,
          'attending': guests[key].attending,
          'relationship': guests[key].relationship,
          'extraGuests': guests[key].extraGuests
        });
      });
      this.setState({ data: guestList });
    });
  };

  getRsvpDisplay = (props) => {
    return props.value
      ? <i className="fa fa-check" aria-hidden="true" style={{color: 'green'}} />
      : <i className="fa fa-times" aria-hidden="true" style={{color: 'red'}} />
  };

  getRsvpFilters = (filter, onChange) => {
    return (
      <select
        onChange={e => onChange(e.target.value)}
        style={{width: '100%'}}
        value={filter ? filter.value : 'all'}
      >
        <option value="all">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    );
  };

  filterRsvp = (filter, row) => {
    if (filter.value === 'all') {
      return true;
    } else {
      return filter.value === String(row[filter.id]);
    }
  };

  render() {
    const { data, currentData } = this.state;

    let nadiaCount = 0;
    let shafeeqCount = 0;

    data.forEach(guest => {
      if (guest.nadia) {
        nadiaCount += parseInt(guest.attending);
      }
      if (guest.shafeeq) {
        shafeeqCount += parseInt(guest.attending);
      }
    });

    const columns = [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'name'
          }
        ]
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Phone',
            accessor: 'phone'
          },
          {
            Header: 'Relation',
            accessor: 'relationship'
          }
        ]
      },
      {
        Header: 'RSVP',
        columns: [
          {
            Header: 'Nadia',
            accessor: 'nadia',
            minWidth: MIN_WIDTH_FOR_RSVP_DETAILS,
            Cell: props => this.getRsvpDisplay(props),
            Filter: ({ filter, onChange }) => this.getRsvpFilters(filter, onChange),
            filterMethod: (filter, row) => this.filterRsvp(filter, row)
          },
          {
            Header: 'Shafeeq',
            accessor: 'shafeeq',
            minWidth: MIN_WIDTH_FOR_RSVP_DETAILS,
            Cell: props => this.getRsvpDisplay(props),
            Filter: ({ filter, onChange }) => this.getRsvpFilters(filter, onChange),
            filterMethod: (filter, row) => this.filterRsvp(filter, row)
          },
          {
            Header: 'Attending',
            accessor: 'attending',
            minWidth: MIN_WIDTH_FOR_RSVP_DETAILS
          }
        ]
      }
    ];

    return (
      <div>
        <div className="row uniform" style={{ paddingBottom: '3em' }}>
          <div className="6u 12u$(small)" style={{ textAlign: 'center' }}>
            <div className="box">
              Nadia Count:<br />
              <h2>{nadiaCount}</h2>
            </div>
          </div>
          <div className="6u$ 12u$(small)" style={{ textAlign: 'center' }}>
            <div className="box">
              Shafeeq Count:<br />
              <h2>{shafeeqCount}</h2>
            </div>
          </div>
        </div>
        <ReactTable
          data={data}
          filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]).toLowerCase().indexOf(String(filter.value).toLowerCase()) !== -1}
          getTdProps={(state, rowInfo) => {
            return {
              onClick: (e, handleOriginal) => {
                this.setState({ currentData: rowInfo.original });
                this.onOpenModal();
                if (handleOriginal) {
                  handleOriginal()
                }
              }
            }
          }}
          columns={columns}
          defaultPageSize={100}
          className='-striped -highlight'
        />
        <Modal open={this.state.open} onClose={this.onCloseModal} little>
          <div style={{textAlign: 'center', padding: '25px 15px'}}>
            <h2>Guest Details</h2>
            <p style={{ margin: 0 }}>Name: <strong>{currentData.name}</strong></p>
            <p style={{ margin: 0 }}>Email: <a href={`mailto:${currentData.email}`}>{currentData.email}</a></p>
            <p style={{ margin: 0 }}>Phone: <a href={`tel:${currentData.phone}`}>{currentData.phone}</a></p>
            <p style={{ margin: 0 }}>Relation: <strong>{currentData.relationship}</strong></p>
            <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{currentData.attending}</span> attending</p>
            <p style={{ margin: 0 }}>{this.getGuestRsvpData(currentData.nadia)} Nadia</p>
            <p style={{ margin: 0 }}>{this.getGuestRsvpData(currentData.shafeeq)} Shafeeq</p>
            {currentData.extraGuests && Object.keys(currentData.extraGuests).map(key => {
              const index = parseInt(key) + 1;
              return (
                <p style={{ margin: 0 }} key={key}>Guest {index}: <strong>{currentData.extraGuests[key]}</strong></p>
              );
            })}
          </div>
        </Modal>
      </div>
    );
  }
}

render(<App />, document.getElementById('guestlist'));