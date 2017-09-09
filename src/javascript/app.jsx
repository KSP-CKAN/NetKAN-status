import React from 'react';
import ReactDom from 'react-dom';
import NetKANs from './components/NetKANs.jsx';
import datatableStyles from
  '../../node_modules/fixed-data-table/dist/fixed-data-table.min.css';

var sheet = document.createElement('style');
sheet.type = 'text/css';
sheet.innerHTML = 'html,body{background-color:#f0f0f0;} input::-webkit-input-placeholder{font-style:italic;}';
document.body.appendChild(sheet);

document.body.innerHTML += '<div id="content"></div>';

ReactDom.render(
  <NetKANs
    url="http://status.ksp-ckan.org/status/netkan.json"
    pollInterval={300000} />,
  document.getElementById('content')
);
