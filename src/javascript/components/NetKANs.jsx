import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';
import $ from 'jquery';

import renderDate from '../lib/renderDate.js';
import debounce from '../lib/debounce.js';
import Highlighted from './Highlighted.js';

export default class NetKANs extends React.Component {
  constructor(props) {
    super(props);
    this.loadNetKANsFromServer = this.loadNetKANsFromServer.bind(this);
    this._updateSort = this._updateSort.bind(this);
    this._onResize = this._onResize.bind(this);
    this._updateTableSize = this._updateTableSize.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._toggleActive = this._toggleActive.bind(this);
    this._toggleFrozen = this._toggleFrozen.bind(this);
    this._toggleMeta = this._toggleMeta.bind(this);
    this._toggleNonmeta = this._toggleNonmeta.bind(this);
    this._games = props.games;
    // Reverse alphabetical because the checkboxes are backwards
    this._games.sort((a, b) => b.name.localeCompare(a.name));
    this.state = {
      data: [],
      tableWidth: 200,
      tableHeight: 500,
      filterId: null,
      sortBy: null,
      sortDir: null,
      activeCount: 0,
      frozenCount: 0,
      metaCount: 0,
      nonmetaCount: 0,
      gameCounts: Object.fromEntries(this._games.map((game) => [game.id, 0])),
      showActive: true,
      showFrozen: false,
      showMeta: true,
      showNonmeta: true,
      showGames: Object.fromEntries(this._games.map((game) => [game.id, true])),
    }

    if (window.addEventListener) {
      window.addEventListener('resize', this._onResize, false);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', this._onResize);
    } else {
      window.onresize = this._onResize;
    }
    setInterval(this.loadNetKANsFromServer, this.props.pollInterval);
    this.loadNetKANsFromServer();
  }
  componentDidMount() {
    this._updateTableSize();
  }
  loadNetKANsFromServer() {
    var all_data = {};
    for (const game of this._games) {
      $.ajax({url: game.status,
              dataType: 'json',
              cache: 'false',
              success: (data) => {
                all_data[game.id] = data;
                if (Object.keys(all_data).length == this._games.length) {
                  // Render once all games' data is received or errored
                  this._loadAllGamesData(all_data);
                }
              },
              error: (xhr, status, err) => {
                console.error(game.status, status, err.toString());
                // Add empty object for this game so we can see the other games
                all_data[game.id] = {};
                if (Object.keys(all_data).length == this._games.length) {
                  // Render once all games' data is received or errored
                  this._loadAllGamesData(all_data);
                }
              }});
    }
  }
  _loadAllGamesData(all_data) {
    const netkan = Object.entries(all_data).flatMap(([game_id, data]) =>
                     Object.entries(data).map(([key, val]) => (
                       {'game_id': game_id,
                        'id': key,
                        ...(val ? val : {})})));
    this.setState({
      data: netkan,
      activeCount: netkan.filter(row => !row.frozen).length,
      frozenCount: netkan.filter(row =>  row.frozen).length,
      metaCount: netkan.filter(row => row.resources.metanetkan).length,
      nonmetaCount: netkan.filter(row => !row.resources.metanetkan).length,
      gameCounts: netkan.reduce((counts, row) => {
                                  ++counts[row.game_id];
                                  return counts;
                                },
                                Object.fromEntries(Object.keys(all_data)
                                                         .map((game_id) => [game_id, 0]))),
    });
    if (!this.state.sortBy) {
        // Sort by errors if any active module has an error,
        // else sort by last indexed time.
        this.setState(netkan.some(row => row.last_error && !row.frozen)
          ? {sortBy: 'last_error',
             sortDir: 'ASC'}
          : {sortBy: 'last_indexed',
             sortDir: 'DESC'});
    }
  }
  _updateSort(key) {
    const sortDir =
        key === this.state.sortBy
            ? (this.state.sortDir === 'ASC' ? 'DESC' : 'ASC')
            : (key === 'id' || key === 'last_error' ? 'ASC' : 'DESC');

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
    const myElt = ReactDOM.findDOMNode(this);
    const { paddingLeft, paddingTop, paddingBottom, paddingRight } = getComputedStyle(myElt);
    const bottom = window.scrollY + Math.max(...
                     ['input', 'h1'].map((tagName) => myElt.getElementsByTagName(tagName))
                                    // of course getElementsByTagName can't simply return a sensible array
                                    .flatMap((htmlColl) => Array.prototype.slice.call(htmlColl))
                                    .map((elt) => elt.getBoundingClientRect().bottom
                                                  + parseFloat(getComputedStyle(elt).marginBottom)));
    this.setState({
      tableWidth:  window.innerWidth  - parseFloat(paddingLeft) - parseFloat(paddingRight),
      tableHeight: window.innerHeight - parseFloat(paddingTop)  - parseFloat(paddingBottom) - bottom,
    });
  }
  _onFilterChange() {
    var input = document.getElementById('filter');
    this.setState({filterId: input.value});
  }
  _sortDirArrow(key) {
    if (key !== this.state.sortBy) {
        return '';
    }
    return this.state.sortDir === 'DESC' ? ' ▾' : ' ▴';
  }
  _header(key, name) {
    return <Cell onClick={this._updateSort.bind(null, key)}>{name} {this._sortDirArrow(key)}</Cell>;
  }
  _netkanLink({id, game_id, frozen}, filterId) {
    const game = this._games.find(g => g.id == game_id);
    return <a {...(frozen ? {style: {textDecoration: 'line-through'}} : {})} href={game.netkan(id, frozen)}>
      {<Highlighted Content={id}
                    Search={filterId}
                    HighlightClassName="highlighted" />}</a>;
  }
  _resourcesList({id, game_id, resources, frozen}) {
    const game = this._games.find(g => g.id == game_id);
    var val = [
      <a href={game.history(id, frozen)}>history</a>,
      " | ",
      <a href={game.metadata(id, frozen)}>metadata</a>
    ];
    if (resources) {
      for (const key of Object.keys(resources).filter(name => !name.startsWith('x_')).sort()) {
        val.push(' | ');
        val.push(<a href={resources[key]}>{key}</a>);
      }
    }
    return val;
  }
  _toggleTheme() {
      var classes = document.body.classList;
      classes.toggle('lightTheme');
      classes.toggle('darkTheme');
      window.localStorage.setItem('darkTheme', classes.contains('darkTheme'));
  }
  _toggleActive() {
    this.setState({showActive: !this.state.showActive});
  }
  _toggleFrozen() {
    this.setState({showFrozen: !this.state.showFrozen});
  }
  _toggleMeta() {
    this.setState({showMeta: !this.state.showMeta});
  }
  _toggleNonmeta() {
    this.setState({showNonmeta: !this.state.showNonmeta});
  }
  _toggleGame(game_id) {
    this.setState({showGames: {...this.state.showGames,
                               [game_id]: !this.state.showGames[game_id]}});
  }
  Array_count_if(array, func) {
    return array.reduce((c, elt) => func(elt) ? c + 1 : c, 0);
  }
  render() {
    const sortBy = this.state.sortBy;
    const sortDir = this.state.sortDir;

    const rows = (
      this.state.filterId
        ? this.state.data.filter(row => {
            var filt = this.state.filterId.toLowerCase();
            return (row.id.toLowerCase().indexOf(filt) !== -1)
              || (row.last_error && row.last_error.toLowerCase().indexOf(filt) !== -1)
              || (row.last_warnings && row.last_warnings.toLowerCase().indexOf(filt) !== -1);
          })
        : this.state.data)
        .filter(row => this.state.showGames[row.game_id])
        .filter(row => row.frozen ? this.state.showFrozen : this.state.showActive)
        .filter(row => row.resources.metanetkan ? this.state.showMeta : this.state.showNonmeta);

    rows.sort((a, b) => {
      let sortVal = 0;
      var aVal = '';
      var bVal = '';
      if (sortBy === 'last_error') {
        if (a.last_error) {
          if (b.last_error) {
            // Two errors, compare them
            aVal = a.last_error;
            bVal = b.last_error;
          } else {
            // Errors sort to top
            return -1;
          }
        } else if (b.last_error) {
          // Errors sort to top
          return 1;
        } else if (a.last_warnings) {
          if (b.last_warnings) {
            // Two warnings, compare them
            aVal = a.last_warnings;
            bVal = b.last_warnings;
          } else {
            // Warnings sort above nothing
            return -1;
          }
        } else if (b.last_warnings) {
          // Warnings sort above nothing
          return 1;
        }
      } else {
        aVal = a[sortBy] ? a[sortBy].toLowerCase() : '';
        bVal = b[sortBy] ? b[sortBy].toLowerCase() : '';
      }
      if (aVal > bVal) {
        sortVal = 1;
      } else if (aVal < bVal) {
        sortVal = -1;
      } else if (sortBy !== 'id') {
        sortVal = a.id < b.id ?  1
                : a.id > b.id ? -1
                :                0;
      }
      return sortDir === 'DESC' ? sortVal * -1 : sortVal;
    });

    const errCount = this.Array_count_if(rows, r => r.last_error);
    const warnCount = this.Array_count_if(rows, r => !r.last_error && r.last_warnings);

    const divstyle = {
      fontSize:        '9pt',
      fontFamily:      'sans-serif',
      padding:         '5px',
    };
    const h1style = {
      fontSize:           '16pt',
      margin:             '0',
      padding:            '5px 0',
      paddingLeft:        '72px',
      backgroundImage:    'url(favicon.ico)',
      backgroundPosition: 'left center',
      backgroundRepeat:   'no-repeat',
    };
    const inputstyle = {
      float:    'right',
      margin:   '1px 5px',
      width:    '20em',
      fontSize: '11pt',
      padding:  '1px 3px',
    };
    const buttonstyle = {
      float:    'right',
      margin:   '1px 5px',
      padding:  '2px 5px',
    };
    const checkboxstyle = {
      float:      'right',
      marginLeft: '12px',
      marginTop:  '3px',
    };
    const labelstyle = {
      float:         'right',
      paddingTop:    '3px',
      paddingBottom: '4px',
      marginRight:   '5px',
    };

    return (
      <div style={divstyle} className="outer">
        <button onClick={this._toggleTheme} style={buttonstyle} title="Toggle theme">
          <span className="darkOnly">☀</span>
          <span className="lightOnly">🌙</span>
        </button>
        <input id='filter' placeholder='filter...' style={inputstyle} autoFocus={true} type='search'
          onChange={debounce(evt => evt.target.value === '' || evt.target.value.length > 3,
                             this._onFilterChange)} />
        <span style={{float: 'right', clear: 'right'}}></span>
        <label style={labelstyle} htmlFor="toggleFrozen">{this.state.frozenCount} frozen</label>
        <input type="checkbox" style={checkboxstyle}
          id="toggleFrozen" checked={this.state.showFrozen} onChange={this._toggleFrozen} />
        <label style={labelstyle} htmlFor="toggleActive">{this.state.activeCount} active</label>
        <input type="checkbox" style={checkboxstyle}
          id="toggleActive" checked={this.state.showActive} onChange={this._toggleActive} />
        <label style={labelstyle} htmlFor="toggleNonmeta">{this.state.nonmetaCount} non-meta</label>
        <input type="checkbox" style={checkboxstyle}
          id="toggleNonmeta" checked={this.state.showNonmeta} onChange={this._toggleNonmeta} />
        <label style={labelstyle} htmlFor="toggleMeta">{this.state.metaCount} meta</label>
        <input type="checkbox" style={checkboxstyle}
          id="toggleMeta" checked={this.state.showMeta} onChange={this._toggleMeta} />
        {
          this._games.map((game) =>
            <span key={game.id}>
              <label style={labelstyle}
                     htmlFor={`toggleGame_${game.id}`}>
                {this.state.gameCounts[game.id]} {game.name}</label>
              <input type="checkbox"
                     style={checkboxstyle}
                     id={`toggleGame_${game.id}`}
                     checked={this.state.showGames[game.id]}
                     onChange={() => this._toggleGame(game.id)} />
            </span>
          )
        }
        <h1 style={h1style}>NetKANs Indexed</h1>
        <Table
          rowHeight={40}
          headerHeight={35}
          rowsCount={rows.length}
          width={this.state.tableWidth}
          height={this.state.tableHeight}
          overflowX="auto"
          overflowY="auto">
          <Column
            header={this._header('id', 'NetKAN')}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {this._netkanLink(rows[rowIndex], this.state.filterId)}
                <div className="moduleMenu">{this._resourcesList(rows[rowIndex])}</div>
              </Cell>
            )}
            fixed={true}
            width={250}
            flexGrow={1}
          />
          <Column
            header={this._header('last_inflated', 'Last Inflated')}
            cell={({rowIndex, ...props}) => (<Cell title={new Date(rows[rowIndex].last_inflated)} {...props}>{renderDate(rows[rowIndex].last_inflated)}</Cell>)}
            fixed={true}
            width={120}
            flexGrow={0}
          />
          <Column
            header={this._header('last_downloaded', 'Last Downloaded')}
            cell={({rowIndex, ...props}) => (<Cell title={new Date(rows[rowIndex].last_downloaded)} {...props}>{renderDate(rows[rowIndex].last_downloaded)}</Cell>)}
            fixed={true}
            width={120}
            flexGrow={0}
          />
          <Column
            header={this._header('last_indexed', 'Last Indexed')}
            cell={({rowIndex, ...props}) => (<Cell title={new Date(rows[rowIndex].last_indexed)} {...props}>{renderDate(rows[rowIndex].last_indexed)}</Cell>)}
            fixed={true}
            width={120}
            flexGrow={0}
          />
          <Column
            header={this._header('last_error', <span><span className="error">{errCount} Errors</span> / <span className="warnings">{warnCount} Warnings</span></span>)}
            cell={({rowIndex, ...props}) => (<Cell {...props}><div className={
                  rows[rowIndex].last_error    ? 'error'
                : rows[rowIndex].last_warnings ? 'warnings'
                : ''
            }>{<Highlighted Content={rows[rowIndex].last_error || rows[rowIndex].last_warnings}
                            Search={this.state.filterId}
                            HighlightClassName="highlighted" />}</div></Cell>)}
            fixed={false}
            width={200}
            flexGrow={4}
          />
        </Table>
      </div>
    );
  }
}
