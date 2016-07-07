import React from 'react';
import ReactDOM from 'react-dom';

// Components
class BillsList extends React.Component {
  render() {
    return <h1>Hello App!</h1>
  }
}

ReactDOM.render(
  <BillsList />,
  document.getElementById('appContainer')
);
