import React, { Component } from 'react';

const db = firebase.database();

class AddBillForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Default Bill Name', dueDate: 1, autoPay: false };
  }

  addNewBill(autoPay, dueDate, name, paid) {
    db.ref(name).set({
      name,
      autoPay,
      dueDate,
      paid: false
    });
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
              this.addNewBill(this.state.autoPay, this.state.dueDate, this.state.name);
              updateBills();
            } }
            value='Add Bill'
          />
        </form>
      </div>
    );
  }
}

export default AddBillForm;
