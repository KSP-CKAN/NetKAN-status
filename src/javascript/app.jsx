import React from 'react';
import ReactDom from 'react-dom';
import NetKANs from './components/NetKANs.jsx';
import datatableStyles from
  '../../node_modules/fixed-data-table/dist/fixed-data-table.min.css';
import customStyles from './app.css';

document.body.className = window.localStorage.getItem('darkTheme')
    ? 'darkTheme' : 'lightTheme';

ReactDom.render(
  <NetKANs
    url="/status/netkan.json"
    pollInterval={300000} />,
  document.body
);
