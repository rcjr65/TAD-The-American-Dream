import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../../css/oswald.css';
import '../../css/open-sans.css';
import '../../css/pure-min.css';
import '../../App.css';
import './style.css';

class Election extends Component {
    
  constructor(props) {
    super(props)
    var d = new Date();
    console.log({d})
    this.state = {
      startDate: moment()
    };
  }

  handleChange = () => {

  }

  render() {
    
    return (
      <div className='containers'>
        <div className='row'>
            <div className='box col-md-4'>
                <h2>SET ELECTION PERIOD</h2>
                <div className='form-control'>
                  <span className='form-label'>Start Day</span>
                  <div>
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="time"
                  />
                  </div>
              </div>
              <div className='form-control'>
                  <span className='form-label'>Last Day:</span>
                  {/* <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="time"
                  /> */}
              </div>
              <div className='form-control'>
                  <div className='btn-wrapper'>
                      <button className='btn btn-success' onClick={() => this.setItem()}>SET</button>
                  </div>
              </div>
            </div>
            <div className='box col-md-8'>
                <h2>ELECTION RESULT</h2>
            </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
};

const mapStateToProps = (state) => ({
    
});

export default connect()(Election);
