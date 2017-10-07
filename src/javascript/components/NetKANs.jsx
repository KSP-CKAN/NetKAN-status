import React from 'react';
import {Table, Column} from 'fixed-data-table';
import $ from 'jquery';

import renderDate from '../lib/renderDate.js';

export default class NetKANs extends React.Component {
  constructor(props) {
    super(props);
    this.loadNetKANsFromServer = this.loadNetKANsFromServer.bind(this);
    this._updateSort = this._updateSort.bind(this);
    this._onResize = this._onResize.bind(this);
    this._updateTableSize = this._updateTableSize.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.state = {
      data: [],
      filterText: '',
      tableWidth: 200,
      tableHeight: 500,
      filterBy: 'failed',
      filterId: null,
      sortBy: 'last_error',
      sortDir: 'DESC'
    }

    if (window.addEventListener) {
      window.addEventListener('resize', this._onResize, false);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', this._onResize);
    } else {
      window.onresize = this._onResize;
    }
    this.loadNetKANsFromServer();
    setInterval(this.loadNetKANsFromServer, this.props.pollInterval);
  }
  loadNetKANsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: 'false',
      success: (data) => {
        const netkan = Object.keys(data).map((key) => {
          const item = data[key];
          item.id = key;
          return item;
        });
        this.setState({data: netkan});
        this._updateTableSize();
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }
  _updateSort(key) {
    const sortDir = key === this.state.sortBy ?
      (this.state.sortDir === 'ASC' ? 'DESC' : 'ASC') : 'DESC';

    this.setState({
      sortBy: key,
      sortDir: sortDir
    });
  }
  _onResize() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(this._updateTableSize, 16);
  }
  _updateTableSize() {
    const widthOffset = window.innerWidth < 680 ? 0 : 20;
    this.setState({
      tableWidth: window.innerWidth - widthOffset,
      tableHeight: window.innerHeight - 50,
    });
  }
  _onFilterChange(e) {
    this.setState({
      filterId: e.target.value
    });
  }
  _renderHeader(label, cellDataKey) {
    return (
      <a onClick={this._updateSort.bind(null, cellDataKey)}>{label}</a>
    );
  }
  render() {
    const sortBy = this.state.sortBy;
    const sortDir = this.state.sortDir;

    const rows = this.state.filterId ?
      this.state.data.filter((row) => {
          var filt = this.state.filterId.toLowerCase();
        return (row['id'].toLowerCase().indexOf(filt) !== -1)
          || (row['last_error'] && row['last_error'].toLowerCase().indexOf(filt) !== -1);
      }) : this.state.data;

    rows.sort((a, b) => {
      let sortVal = 0;
      a = a[sortBy] ?
        a[sortBy].toLowerCase() : '';
      b = b[sortBy] ?
        b[sortBy].toLowerCase() : '';

      if (a > b) {
        sortVal = 1;
      }
      if (a < b) {
        sortVal = -1;
      }
      return sortDir === 'DESC' ?
        sortVal * -1 : sortVal;
    });

    const sortDirArrow = (key) => {
      if (key !== this.state.sortBy) {
        return ''
      }
      return this.state.sortDir === 'DESC' ?
        ' ▾' : ' ▴'
    };

    const divstyle = {
      fontSize: '9pt'
    };
    const h1style = {
      color:              '#333',
      fontSize:           '16pt',
      margin:             '5px 0',
      paddingLeft:        '72px',
      backgroundImage:    'url(favicon.ico)',
      backgroundPosition: 'left center',
      backgroundRepeat:   'no-repeat'
    };
    const inputstyle = {
      float:    'right',
      margin:   '1px 5px',
      width:    '20em',
      fontSize: '11pt',
      padding:  '1px 3px'
    };

    return (
      <div style={divstyle}>
        <input onChange={this._onFilterChange} placeholder='filter...' style={inputstyle} autoFocus='true' type='search' />
        <h1 style={h1style}>NetKANs Indexed</h1>
        <Table
          rowHeight={40}
          headerHeight={30}
          rowGetter={index => rows[index]}
          rowsCount={rows.length}
          width={this.state.tableWidth}
          height={this.state.tableHeight}
          overflowX="auto"
          overflowY="auto">
          <Column
            headerRenderer={this._renderHeader.bind(this)}
            cellRenderer={id => <a href={"https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/" + id + ".netkan"}>{id}</a>}
            dataKey="id"
            fixed={true}
            label={'NetKAN' + sortDirArrow('id')}
            width={200}
            flexGrow={1}
          />
          <Column
            headerRenderer={this._renderHeader.bind(this)}
            cellRenderer={renderDate}
            dataKey="last_checked"
            fixed={true}
            label={'Last Checked' + sortDirArrow('last_checked')}
            width={120}
            flexGrow={0}
          />
          <Column
            headerRenderer={this._renderHeader.bind(this)}
            cellRenderer={renderDate}
            dataKey="last_inflated"
            fixed={true}
            label={'Last Inflated' + sortDirArrow('last_inflated')}
            width={120}
            flexGrow={0}
          />
          <Column
            headerRenderer={this._renderHeader.bind(this)}
            cellRenderer={renderDate}
            dataKey="last_indexed"
            fixed={true}
            label={'Last Indexed' + sortDirArrow('last_indexed')}
            width={120}
            flexGrow={0}
          />
          <Column
            headerRenderer={this._renderHeader.bind(this)}
            dataKey="last_error"
            fixed={false}
            label={'Last Error' + sortDirArrow('last_error')}
            width={200}
            flexGrow={4}
          />
        </Table>
      </div>
    );
  }
};
