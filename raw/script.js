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
    paid: false
  });
}

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
        this.setState({ bills: Object.keys(snapshot.val()).map(item => snapshot.val()[item]).sort((a, b) => {
          if (a.dueDate > b.dueDate) {
            return 1;
          }
          if (a.dueDate < b.dueDate) {
            return -1;
          }
          return 0;
        }) });
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
      <div>
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
        <div className='addBillForm'>
          <AddBillForm updateBills={ this.fetchBills.bind(this) } />
        </div>
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
        <label>Paid?</label>
        <input
          type='checkbox'
          onChange={ this.togglePaid.bind(this) }
          defaultChecked={ this.state.paid }
        />
        <p 
          className='remove'
          onClick={ () => {
            this.removeBill();
            updateBills();
          } }>
          remove
        </p>
      </div>
    );
  }
}

class AddBillForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Default Bill Name', dueDate: 1, autoPay: false };
  }

  render() {
    let { updateBills } = this.props;
    return (
      <div>
        <h2>Add New Bill</h2>
        <form>
          <div className='field'>
            <label htmlFor='bill-name'>Bill Name</label>
            <input
              type='text'
              id='bill-name'
              placeholder='(ex. "Utilities, Energy Co.")'
              onChange={ (event) => this.setState({ name: event.target.value }) }
            />
          </div>
          <div className='field'>
            <label htmlFor='due-date'>Day of Month Due</label>
            <input
              type='text'
              id='due-date'
              placeholder='(ex. 1, 3, 8)'
              onChange={ (event) => this.setState({ dueDate: parseInt(event.target.value) }) }
            />
          </div>
          <div className='field'>
            <label>Is this bill setup for auto pay?</label>
            <div className='radios'>
              <input
                type='radio'
                name='auto-pay'
                value='Yes'
                onChange={ (event) => this.setState({ autoPay: true }) }
              />Yes
              <input
                type='radio'
                name='auto-pay'
                value='No'
                onChange={ (event) => this.setState({ autoPay: false }) }
              />No
            </div>
          </div>
          <input
            type='submit'
            onClick={ (event) => {
              event.preventDefault();
              addNewBill(this.state.autoPay, this.state.dueDate, this.state.name);
              updateBills();
            } }
            value='Add Bill'
          />
        </form>
      </div>
    );
  }
}

ReactDOM.render(
  <BillsList />,
  document.getElementById('appContainer')
);
