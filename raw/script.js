import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

const db = firebase.database();

/*
App Layout

BillsList
  DateContainer
    Bill
    Bill
  DateContainer
    Bill
AddBillForm
*/

// Bills
// let bills = [
//   { id: 0, name: 'Rent, Arthur Properties LLC', dueDate: 1, autoPay: false, paid: true },
//   { id: 1, name: 'Health Insurance, CIGNA', dueDate: 1, autoPay: false, paid: false },
//   { id: 2, name: 'Credit Card, Barclay', dueDate: 3, autoPay: false, paid: true },
//   { id: 3, name: 'Phone, AT&T', dueDate: 4, autoPay: false, paid: true },
//   { id: 4, name: 'HBO Now', dueDate: 8, autoPay: true, paid: false },
//   { id: 5, name: 'Car Payment, Honda', dueDate: 13, autoPay: false, paid: false },
//   { id: 6, name: 'Credit Card, Capital One', dueDate: 15, autoPay: false, paid: false },
//   { id: 7, name: 'Internet, XFINITY', dueDate: 16, autoPay: false, paid: false },
//   { id: 8, name: 'Netflix', dueDate: 16, autoPay: true, paid: false },
//   { id: 9, name: 'Car Insurance, GEICO', dueDate: 23, autoPay: true, paid: false },
//   { id: 10, name: 'Renter\'s Insurance, Assurant', dueDate: 23, autoPay: true, paid: false },
//   { id: 11, name: 'Code School', dueDate: 25, autoPay: true, paid: false }
// ];

// Utilities
function slugify(string) {
  return string
          .toLowerCase()
          .replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
          .replace(/ /g, '-');
}

function addNewBill(autoPay, dueDate, name, paid) {
  let slugifiedName = slugify(name);
  db.ref(slugifiedName).set({
    name,
    autoPay,
    dueDate,
    paid
  });
}

// Test addNewBill
// addNewBill(false, 1, 'Rent, Arthur Properties LLC', true);

// Components
class BillsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bills: [] };
  }

  componentWillMount() {
    db.ref().once('value').then(snapshot => {
      this.setState({ bills: Object.keys(snapshot.val()).map(item => snapshot.val()[item]) });
    });
  }

  render() {
    let { bills } = this.state;
    // loop through all bills and generate a new array
    // with one of each unique date
    let dates = Array.from(new Set(bills.map(item => item.dueDate)));
    return (
      <div className='billsList'>
        <h1>Bills for { moment().format('MMMM YYYY') }</h1>
        {
          dates.map(date => {
            return (
              <DateContainer date={ date } key={`${ date }-container`} bills={ bills } />
            )
          })
        }
      </div>
    );
  }
}

class DateContainer extends React.Component {
  render() {
    let { bills } = this.props;
    let calculatedDate = moment().startOf('month').add(`${ this.props.date - 1 }`, 'days').format('Do').toString();
    return (
      <div className='dateContainer'>
        <h3>{ calculatedDate }</h3>
        {
          bills.map(bill => {
            if (bill.dueDate === this.props.date) {
              return (
                <Bill
                  name={ bill.name }
                  dueDate={ calculatedDate }
                  paid={ bill.paid }
                  key={ `${ bill.name }-bill` }
                  bills={ bills }
                />
              );
            }
          })
        }
      </div>
    );
  }
}

class Bill extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paid: this.props.paid }
  }

  togglePaid() {
    this.setState({ paid: !this.state.paid });
  }

  render() {
    return (
      <div className='bill'>
        <p>{ this.props.name }</p>
        <input
          type='checkbox'
          onChange={ this.togglePaid.bind(this) }
          defaultChecked={ this.state.paid }
        />
      </div>
    );
  }
}

class AddBillForm extends React.Component {
  render() {
    return <h3>A form</h3>
  }
}

ReactDOM.render(
  <BillsList />,
  document.getElementById('appContainer')
);
