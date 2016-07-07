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
  { name: 'HBO Now', dueDate: 8, autoPay: true, paid: false }
];

// Components
class BillsList extends React.Component {
  render() {
    // loop through all bills and generate a new array
    // with one of each unique date
    // let a = bills.map(item => item.dueDate);
    // let b = new Set(a);
    // let c = Array.from(b);
    // console.log(bills);
    // console.log('a: ', a);
    // console.log('b: ', b);
    // console.log('c: ', c);
    let dates = Array.from(new Set(bills.map(item => item.dueDate)));
    return (
      <div className='billsList'>
        <h1>Bills for { moment().format('MMMM YYYY') }</h1>
        {
          dates.map(date => {
            return (
              <DateContainer date={ date } />
            )
          })
        }
      </div>
    );
  }
}

class DateContainer extends React.Component {
  render() {
    let monthStart = moment().startOf('month');
    let dueDate = this.props.date - 1;
    return (
      <div className='dateContainer'>
        <h1>{ bills[0].name }</h1>
        <Bill name="AT&T" dueDate={ monthStart.add(`${ this.props.date - 1 }`, 'days').format('Do').toString() } />
      </div>
    );
  }
}

class Bill extends React.Component {
  render() {
    return (
      <div className='bill'>
        <h2>{ this.props.name }</h2>
        <p>Due on the { this.props.dueDate }</p>
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
