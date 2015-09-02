var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var renderDate = function(date) {
  if ( ! date ) {
    return "N/A";
  } else {
    return moment(date).fromNow();
  }
}

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

var NetKANs = React.createClass({
  loadNetKANsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: 'false',
      success: function(data) {
        var netkan = Object.keys(data).map(function(key) {
          var item = data[key];
          item.id = key;
          return item;
        });
        this.setState({data: netkan});
        this._onDataLoad();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      data: [],
      filterText: '',
      tableWidth: '200',
      tableHeight: '500',
      filteredRows: [],
      filterBy: 'failed',
      filterId: null,
      sortBy: 'id',
      sortDir: null
    };
  },

  componentDidMount: function() {
    this.loadNetKANsFromServer();
    this._update();
    var win = window;
    if (win.addEventListener) {
      win.addEventListener('resize', this._onResize, false);
    } else if (win.attachEvent) {
      win.attachEvent('onresize', this._onResize);
    } else {
      win.onresize = this._onResize;
    }
    
    setInterval(this.loadNetKANsFromServer, this.props.pollInterval);
  },

  _onDataLoad() {
    this._filterRowsBy(this.state.filterId);
    this._sortRowsBy(this.state.sortBy);
  },

  _onResize() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(this._update, 16);
  },

  _update() {
    var win = window;

    var widthOffset = win.innerWidth < 680 ? 0 : 240;

    this.setState({
      renderPage: true,
      tableWidth: win.innerWidth - widthOffset,
      tableHeight: win.innerHeight - 200,
    });
  },

  _sortRowsBy(cellDataKey) {
    var sortDir = this.state.sortDir;
    var sortBy = cellDataKey;
    if (sortBy === this.state.sortBy) {
      sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
    } else {
      sortDir = SortTypes.DESC;
    }
    
    var filteredRows = this.state.filteredRows.slice();
    filteredRows.sort((a, b) => {
      var sortVal = 0;
      if (a[sortBy] > b[sortBy]) {
        sortVal = 1;
      }
      if (a[sortBy] < b[sortBy]) {
        sortVal = -1;
      }
      
      if (sortDir === SortTypes.DESC) {
        sortVal = sortVal * -1;
      }
      
      return sortVal;
    });
    
    this.setState({
      filteredRows,
      sortBy,
      sortDir,
    });
  },

  _filterRowsBy(filterId) {
    var data = this.state.data.slice();
    
    var filteredRows = filterId ? data.filter(function(row){
      return row['id'].toLowerCase().indexOf(filterId.toLowerCase()) >= 0
    }) : data;

    this.setState({
      filteredRows,
      filterId,
    })
  },

  _onFilterChange(e) {
    this._filterRowsBy(e.target.value);
  },

  _renderHeader(label, cellDataKey) {
    return (
      <a onClick={this._sortRowsBy.bind(null, cellDataKey)}>{label}</a>
    );
  },

  _rowGetter(index){
    return this.state.filteredRows[index];
  },

  render() {
    var controlledScrolling =
          this.props.left !== undefined || this.props.top !== undefined;
    
    var sortDirArrow = '';
    
    if (this.state.sortDir !== null){
      sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
    }    

    return (
      <div>
        <h1>NetKANs Indexed</h1>
        <input onChange={this._onFilterChange} placeholder='Filter by NetKAN' />
        <Table
          rowHeight={50}
          headerHeight={50}
          rowGetter={this._rowGetter}
          rowsCount={this.state.filteredRows.length}
          width={this.state.tableWidth}
          height={this.state.tableHeight}
          onContentHeightChange={this._onContentHeightChange}
          scrollTop={this.props.top}
          scrollLeft={this.props.left}
          overflowX={controlledScrolling ? "hidden" : "auto"}
          overflowY={controlledScrolling ? "hidden" : "auto"}>
          <Column
            headerRenderer={this._renderHeader}
            dataKey="id"
            fixed={true}
            label={"NetKAN" + (this.state.sortBy === 'id' ? sortDirArrow : '')}
            width={200}
            flexGrow={4}
          />
          <Column
            headerRenderer={this._renderHeader}
            cellRenderer={renderDate}
            dataKey="last_checked"
            fixed={true}
            label={"Last Checked" + (this.state.sortBy === 'last_checked' ? sortDirArrow : '')}
            width={100}
            flexGrow={1}
          />
          <Column
            headerRenderer={this._renderHeader}
            cellRenderer={renderDate}
            dataKey="last_inflated"
            fixed={true}
            label={"Last Inflated" + (this.state.sortBy === 'last_inflated' ? sortDirArrow : '')}
            width={100}
            flexGrow={1}
          />
          <Column
            headerRenderer={this._renderHeader}
            cellRenderer={renderDate}
            dataKey="last_indexed"
            fixed={true}
            label={"Last Indexed" + (this.state.sortBy === 'last_indexed' ? sortDirArrow : '')}
            width={100}
            flexGrow={1}
          />
          <Column
            dataKey="last_error"
            fixed={true}
            label="Last Error"
            width={200}
            flexGrow={1}
          />
        </Table>
      </div>
    );
  }
});

React.render(
  <NetKANs url="https://dl.dropboxusercontent.com/u/8415802/status/netkan.json" pollInterval={300000} />,
  document.getElementById('content')
);
