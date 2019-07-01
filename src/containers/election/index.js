import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactModal from 'react-modal';

import {setPeriod, loadData, editVote} from '../../actions/election';
import ElectionTable from '../../components/electionTable';

import '../../css/oswald.css';
import '../../css/open-sans.css';
import '../../css/pure-min.css';
import '../../App.css';
import './style.css';

const customStyles = {
  overlay: { 
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  content : {
    display: 'flex',
    flexDirection: 'column',
    color: 'white', 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    margin: '15% calc(15% - 60px)', 
    width: '50%', 
    height: '35%', 
    border: 'none', 
    borderRadius: '5px', 
    alignItems: 'center', 
  }
};
class Election extends Component {
    
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      isOpen: false,
      votes: 0,
      candidacyCode: '',
    };
  }

  componentDidMount() {
    this.props.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.startDate !== this.props.startDate) {
      this.setState({startDate: this.props.startDate})
    }

    if (prevProps.endDate !== this.props.endDate) {
      this.setState({endDate: this.props.endDate})
    }
  }

  handleStartChange = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleLastChange = (date) => {
    this.setState({
      endDate: date
    });
  }

  setTime = () => {
    var params = {
      startTime: this.state.startDate,
      endTime: this.state.endDate
    }
    this.props.setPeriod(params);
  }

  onAction = (e, params) => {
    if(e == 0) { // edit
      this.setState({votes: params.votes, isOpen: true, candidacyCode: params.candidacyCode})
    }
    else { // remove
      var params = {
        votes: 0,
        candidacyCode: this.state.candidacyCode
      }
      this.props.editVote(params)
    }
  }

  handleCloseModal = () => {
    this.setState({isOpen: false})
  }

  btnChange = () => {
    this.setState({isOpen: false})
    var params = {
      votes: this.state.votes,
      candidacyCode: this.state.candidacyCode
    }
    this.props.editVote(params)
  }

  render() {
    return (
      <div className='containers'>
        <div className='row'>
            <div className='box col-md-4'>
                <h2>SET ELECTION PERIOD</h2>
                <div className='form-control-date'>
                  <span className='form-label'>Start Day :</span>
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleStartChange}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={30}
                    dateFormat='MMMM d, yyyy h:mm aa'
                    timeCaption='time'
                  />
              </div>
              <div className='form-control-date'>
                  <span className='form-label'>Last Day :</span>
                  <DatePicker
                    selected={this.state.endDate}
                    onChange={this.handleLastChange}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={30}
                    dateFormat='MMMM d, yyyy h:mm aa'
                    timeCaption='time'
                    minDate={this.state.startDate}
                  />
              </div>
              <div className='form-control'>
                  <div className='btn-wrapper'>
                      <button className='btn btn-success' onClick={() => this.setTime()}>SET</button>
                  </div>
              </div>
            </div>
            <div className='box col-md-8'>
                <h2>ELECTION RESULT</h2>
                <ElectionTable electionResult={this.props.electionResult} onAction={(e, params)=>this.onAction(e, params)} />
            </div>
            <ReactModal
              isOpen={this.state.isOpen}
              onRequestClose={this.handleCloseModal}
              contentLabel='Controls'
              style={customStyles}
              ariaHideApp={false}
            >
            <h2>Votes</h2>
            <input
              onChange={(event)=>this.setState({ votes: event.target.value})}
              value={this.state.votes}
              style={{ backgroundColor: 'grey', border: 'none', borderRadius: '4px', padding: 10, width:'50%' }} />
            <br />
            <button className='btnModal' onClick={this.btnChange}>SET</button>
          </ReactModal>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setPeriod,
  loadData,
  editVote
};

const mapStateToProps = ({election}) => ({
  startDate: election.startDate,
  endDate: election.endDate,
  electionResult: election.electionResult
});

export default connect(mapStateToProps, mapDispatchToProps)(Election);
