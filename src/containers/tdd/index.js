import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../css/oswald.css';
import '../../css/open-sans.css';
import '../../css/pure-min.css';
import '../../App.css';
import './style.css';

class Tdd extends Component {
    
  render() {
    
    return (
      <div className='containers'>
      </div>
    );
  }
}

const mapDispatchToProps = {
};

const mapStateToProps = (state) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(Tdd);
