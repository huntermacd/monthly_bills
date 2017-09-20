import React, { Component } from 'react';
import moment from 'moment';
import Bill from './Bill';

class DateContainer extends Component {
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

export default DateContainer;
