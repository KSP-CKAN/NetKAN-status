import React from 'react';
import ReactDom from 'react-dom';
import NetKANs from './components/NetKANs.jsx';
import datatableStyles from
  '../../node_modules/fixed-data-table/dist/fixed-data-table.min.css';

var sheet = document.createElement('style');
sheet.type = 'text/css';
sheet.innerHTML = `
html, body {
    color: rgb(255, 255, 255);
    background-color: rgb(19, 19, 19);
    font-family: sans-serif;
}
#content .public_fixedDataTable_main,
#content .public_fixedDataTableRow_main,
#content .public_fixedDataTableRow_fixedColumnsDivider,
#content .public_fixedDataTableRow_even {
    color: rgb(255, 255, 255);
    background-color: rgb(19, 19, 19);
    font-family: sans-serif;
    border-color: rgba(255, 255, 255, 0.1);
}
#content .public_fixedDataTable_header, #content .public_fixedDataTable_header .public_fixedDataTableCell_main {
    background-color: rgba(40, 40, 40, 0.98);
    background-image: linear-gradient(rgba(40, 40, 40, 0.98), rgba(32, 32, 32, 0.98));
}
#content .public_fixedDataTableCell_main {
    background-color: inherit;
    background-image: inherit;
    border-color: rgba(255, 255, 255, 0.1);
}
#content .public_fixedDataTableRow_odd {
    color: rgb(255, 255, 255);
    background-color: rgb(27, 27, 27);
    font-family: sans-serif;
    border-color: rgba(255, 255, 255, 0.1);
}
input::-webkit-input-placeholder {
    font-style: italic;
}
a:link, a:visited {
    text-decoration: none;
    color: rgb(62, 166, 255);
}
a:hover, a:active {
    text-decoration: underline;
}
.moduleMenu {
    visibility: hidden;
}
.moduleCell:hover .moduleMenu {
    visibility: visible;
}
.moduleMenu, .moduleMenu a:link, .moduleMenu a:visited {
    color: rgb(144, 144, 144);
}
`;
document.body.appendChild(sheet);

document.body.innerHTML += '<div id="content"></div>';

ReactDom.render(
  <NetKANs
    url="http://status.ksp-ckan.space/status/netkan.json"
    pollInterval={300000} />,
  document.getElementById('content')
);
