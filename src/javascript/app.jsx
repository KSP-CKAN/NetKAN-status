import React from 'react';
import ReactDom from 'react-dom';
import NetKANs from './components/NetKANs.jsx';
import datatableStyles from
  '../../node_modules/fixed-data-table/dist/fixed-data-table.min.css';
import customStyles from './app.css';

document.body.className = window.localStorage.getItem('darkTheme')
    ? 'darkTheme' : 'lightTheme';

const ksp = {
  'id': 'ksp',
  'name': 'KSP',
  'status': '/status/netkan.json',
  'netkan': (ident, frozen) =>
    frozen ? `https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/${ident}.frozen`
           : `https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/${ident}.netkan`,
  'history': (ident, frozen) =>
    frozen ? `https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/${ident}.frozen`
           : `https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/${ident}.netkan`,
  'metadata': (ident) => `https://github.com/KSP-CKAN/CKAN-meta/tree/master/${ident}`,
};

const ksp2 = {
  'id': 'ksp2',
  'name': 'KSP2',
  'status': '/status/netkan-ksp2.json',
  'netkan': (ident, frozen) =>
    frozen ? `https://github.com/KSP-CKAN/KSP2-NetKAN/tree/main/NetKAN/${ident}.frozen`
           : `https://github.com/KSP-CKAN/KSP2-NetKAN/tree/main/NetKAN/${ident}.netkan`,
  'history': (ident, frozen) =>
    frozen ? `https://github.com/KSP-CKAN/KSP2-NetKAN/commits/main/NetKAN/${ident}.frozen`
           : `https://github.com/KSP-CKAN/KSP2-NetKAN/commits/main/NetKAN/${ident}.netkan`,
  'metadata': (ident) => `https://github.com/KSP-CKAN/KSP2-CKAN-meta/tree/main/${ident}`,
};

ReactDom.render(
  <NetKANs games={[ksp, ksp2]}
           pollInterval={300000} />,
  document.body
);
