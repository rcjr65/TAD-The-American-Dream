import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faEdit, faSave, faTrash);

import '../../css/oswald.css';
import '../../css/open-sans.css';
import '../../css/pure-min.css';
import '../../App.css';
import './style.css';

export default class ElectionTable extends Component {
  constructor(props) {
    super(props)
  }

  actionCell = (cellInfo) => {      
    return (
        <div className='action'>
            <FontAwesomeIcon size='lg' color='white' icon='edit' onClick={()=>this.props.onAction(0, cellInfo.original)} />
            <FontAwesomeIcon size='lg' color='white' icon='trash' onClick={()=>this.props.onAction(1, cellInfo.original)} />
        </div>
    );
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
                    accessor: 'votes'
                },
                {
                    Header: 'ACTION',
                    Cell: this.actionCell
                },
            ]}
            defaultPageSize={10}
            className='-striped -highlight orgTable'
        />
    );
  }
}
