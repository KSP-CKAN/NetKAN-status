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
  render: function() {
    return (
      <div>
        <h1>NetKANs Indexed</h1>
          <table className="table table-striped">
          <thead>
            <th>NetKAN</th>
            <th>Last Checked</th>
            <th>Last Inflated</th>
            <th>Last Indexed</th>
            <th>Last Error</th>
          </thead>
          <NetKANList 
            data={this.state.data}
            filterText={this.state.filterText.toLowerCase()}
          />
        </table>
      </div>
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

var NetKANList = React.createClass({
  render: function() {
    var netkanNodes = [];
    this.props.data.sort(dynamicSort("id")).map(function (netkan) {
      if (this.props.filterText && netkan.id.toLowerCase().indexOf(this.props.filterText) === -1) {
        return;
      }
      netkanNodes.push(
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
