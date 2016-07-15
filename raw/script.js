import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

const db = firebase.database();

// Utilities
function addNewBill(autoPay, dueDate, name, paid) {
  db.ref(name).set({
    name,
    autoPay,
    dueDate,
    paid
  });
}

// Test addNewBill
// addNewBill(false, 1, 'Rent, Arthur Properties LLC', true);
// addNewBill(false, 1, 'qwerty', true);

// Components
class BillsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bills: [] };
  }

  componentWillMount() {
    this.fetchBills();
  }

  fetchBills() {
    db.ref().once('value').then(snapshot => {
      if (snapshot.val() != null) {
        this.setState({ bills: Object.keys(snapshot.val()).map(item => snapshot.val()[item]) });
      } else {
        this.setState({ bills: [] });
      }
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
              <DateContainer
                date={ date }
                key={`${ date }-container`}
                bills={ bills }
                updateBills={ this.fetchBills.bind(this) }
              />
            )
          })
        }
      </div>
    );
  }
}

class DateContainer extends React.Component {
  render() {
    let { bills, updateBills } = this.props;
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
                  updateBills={ updateBills }
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
    let paid = !this.state.paid;
    this.setState({ paid: paid });
    db.ref(this.props.name).update({ paid });
  }

  removeBill() {
    db.ref(this.props.name).remove();
  }

  render() {
    let { bills, updateBills } = this.props;
    return (
      <div className='bill'>
        <p>{ this.props.name }</p>
        <input
          type='checkbox'
          onChange={ this.togglePaid.bind(this) }
          defaultChecked={ this.state.paid }
        />
        <a href='#' onClick={ () => {
          this.removeBill();
          updateBills();
        } }>
          remove
        </a>
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
