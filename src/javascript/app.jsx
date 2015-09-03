import React from 'react';
import NetKANs from './components/NetKANs.jsx';
import datatableStyles from
  '../../node_modules/fixed-data-table/dist/fixed-data-table.min.css'

document.body.innerHTML += '<div id="content"></div>';

React.render(
  <NetKANs
    url="https://dl.dropboxusercontent.com/u/8415802/status/netkan.json"
    pollInterval={300000} />,
  document.getElementById('content')
);
