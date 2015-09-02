var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

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
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: [],
      filterText: ''
    };
  },
  componentDidMount: function() {
    this.loadNetKANsFromServer();
    setInterval(this.loadNetKANsFromServer, this.props.pollInterval);
  },
  _rowGetter(index){
    return this.state.data.getObjectAt(index);
  },
  render: function() {
    return (
      <div>
        <h1>NetKANs Indexed</h1>
        <NetKANTable />    
      </div>
    );
  }
});

var NetKANTable = React.createClass({
  render: function() {
    console.log(this.state);
    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowGetter={this._rowGetter}
        rowsCount={this.state.data.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        onContentHeightChange={this._onContentHeightChange}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <Column
          dataKey="id"
          fixed={true}
          label="NetKAN"
          width={100}
        />
        <Column
          dataKey="last_checked"
          fixed={true}
          label="Last Checked"
          width={100}
        />
      </Table>
    );
  }
});


var dateNull = function(date) {
  if ( ! date ) {
    return "N/A";
  } else {
    return moment(date).fromNow();
  }
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

var netkanIdFilter = function(filter, netkanId) {
  return filter && netkanId.toLowerCase().indexOf(filter) === -1
}

var NetKANList = React.createClass({
  render: function() {
    var netkanNodes = this.props.data.sort(dynamicSort("id"))
      .map(function(netkan) {
        if (netkanIdFilter(this.props.filterText, netkan.id)) {
          return null;
        }
        return (
          <tr>
            <td>{netkan.id}</td>
            <td>{dateNull(netkan.last_checked)}</td>
            <td>{dateNull(netkan.last_inflated)}</td>
            <td>{dateNull(netkan.last_indexed)}</td>
            <td>{netkan.last_error}</td>
          </tr>
        );
    }.bind(this));
    return (
      <tbody>
        {netkanNodes}
      </tbody>
    );
  }
}); 

React.render(
  <NetKANs url="https://dl.dropboxusercontent.com/u/8415802/status/netkan.json" pollInterval={300000} />,
  document.getElementById('content')
);
