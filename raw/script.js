import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

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
let bills = [
  { name: 'Rent, Arthur Properties LLC', dueDate: 1, autoPay: false, paid: true },
  { name: 'Health Insurance, CIGNA', dueDate: 1, autoPay: false, paid: false },
  { name: 'Credit Card, Barclay', dueDate: 3, autoPay: false, paid: false },
  { name: 'Phone, AT&T', dueDate: 4, autoPay: false, paid: false },
  { name: 'HBO Now', dueDate: 8, autoPay: true, paid: false },
  { name: 'Car Payment, Honda', dueDate: 13, autoPay: false, paid: false },
  { name: 'Credit Card, Capital One', dueDate: 15, autoPay: false, paid: false },
  { name: 'Internet, XFINITY', dueDate: 16, autoPay: false, paid: false },
  { name: 'Netflix', dueDate: 16, autoPay: true, paid: false },
  { name: 'Car Insurance, GEICO', dueDate: 23, autoPay: true, paid: false },
  { name: 'Renter\'s Insurance, Assurant', dueDate: 23, autoPay: true, paid: false },
  { name: 'Code School', dueDate: 25, autoPay: true, paid: false }
];

// Components
class BillsList extends React.Component {
  render() {
    // loop through all bills and generate a new array
    // with one of each unique date
    let dates = Array.from(new Set(bills.map(item => item.dueDate)));
    return (
      <div className='billsList'>
        <h1>Bills for { moment().format('MMMM YYYY') }</h1>
        {
          dates.map(date => {
            return (
              <DateContainer date={ date } key={`${ date }-container`} />
            )
          })
        }
      </div>
    );
  }
}

class DateContainer extends React.Component {
  render() {
    return (
      <div className='dateContainer'>
        {
          bills.map(bill => {
            if (bill.dueDate === this.props.date) {
              return (
                <Bill
                  name={ bill.name }
                  dueDate={ moment().startOf('month').add(`${ this.props.date - 1 }`, 'days').format('Do').toString() }
                  key={ `${ bill.name }-bill` }
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
  render() {
    return (
      <div className='bill'>
        <p>{ this.props.name } due on { this.props.dueDate }</p>
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
