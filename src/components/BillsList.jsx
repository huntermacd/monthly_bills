import React, { Component } from 'react';
import moment from 'moment';
import AddBillForm from './AddBillForm';
import DateContainer from './DateContainer';
import { css } from 'emotion';

const db = firebase.database();

const billsListStyles = css`
  & h1 {
    text-align: center;
  }
`;

class BillsList extends Component {
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
        <div className={billsListStyles}>
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

export default BillsList;
