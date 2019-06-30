import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {setPeriod, loadData} from '../../actions/election';
import ElectionTable from '../../components/electionTable';

import '../../css/oswald.css';
import '../../css/open-sans.css';
import '../../css/pure-min.css';
import '../../App.css';
import './style.css';

class Election extends Component {
    
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
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
                <ElectionTable electionResult={this.props.electionResult} />
            </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setPeriod,
  loadData
};

const mapStateToProps = ({election}) => ({
  startDate: election.startDate,
  endDate: election.endDate,
  electionResult: election.electionResult
});

export default connect(mapStateToProps, mapDispatchToProps)(Election);
