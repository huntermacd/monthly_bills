import React, { Component } from 'react';
import moment from 'moment';
import Bill from './Bill';
import { css } from 'emotion';

const dateContainerStyles = css`
  background-color: aliceblue;
  border-top: 1px solid rebeccapurple;
  padding: 15px;

  & h3 {
    background-color: white;
    height: 25px;
    margin-top: 0;
    padding: 10px;
    text-align: center;
    width: 35px;
  }
`;

class DateContainer extends Component {
  render() {
    let { bills, updateBills } = this.props;
    let calculatedDate = moment().startOf('month').add(`${ this.props.date - 1 }`, 'days').format('Do').toString();
    return (
      <div className={dateContainerStyles}>
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
