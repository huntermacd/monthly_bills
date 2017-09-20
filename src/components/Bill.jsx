import React, { Component } from 'react';

const db = firebase.database();

class Bill extends Component {
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

export default Bill;
