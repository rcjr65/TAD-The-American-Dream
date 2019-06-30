import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import '../../css/oswald.css';
import '../../css/open-sans.css';
import '../../css/pure-min.css';
import '../../App.css';
import './style.css';

export default class ElectionTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      
    return (        
        <ReactTable
            data={this.props.electionResult}
            noDataText='No data available!'
            columns={[
                {
                    Header: 'CANDIDATE CODE',
                    accessor: 'candidacyCode',
                },
                {
                    Header: 'CANDIDATE NAME',
                    accessor: 'candidacyName'
                },
                {
                    Header: 'VOTES',
                    accessor: 'numbersOfVotes'
                }
            ]}
            defaultPageSize={10}
            className='-striped -highlight orgTable'
        />
    );
  }
}
