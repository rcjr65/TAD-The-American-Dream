import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import HttpsRedirect from 'react-https-redirect';
import './App.css';

import Home from './containers/home';
import Lottery from './containers/lottery';
import Auction from './containers/auction';
import Election from './containers/election';
import Tdd from './containers/tdd';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: ''
        }
    }

    _handleClick = (menuItem) => {
        this.setState({ active: menuItem });
    }

    render() {
        const activeStyle = { color: 'rgb(216, 213, 26)' };
        return (
            <Router>
                <div className='app'>
                    <header className='app-header'>
                        <h1 className='app-title'>THE AMERICAN DREAM</h1>
                        <div className='menu'>
                            <ul>
                                <li>
                                    <Link
                                        style={this.state.active === 'GOVERNANCE' ? activeStyle : {}} 
                                        onClick={() => this._handleClick('GOVERNANCE')} 
                                        to='/' >
                                        GOVERNANCE
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        style={this.state.active === 'LOTTERY' ? activeStyle : {}} 
                                        onClick={() => this._handleClick('LOTTERY')} 
                                        to='/dream-stakes' >
                                        DREAMSTAKES
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        style={this.state.active === 'AUCTION' ? activeStyle : {}} 
                                        onClick={() => this._handleClick('AUCTION')} 
                                        to='/auction' >
                                        AUCTION
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        style={this.state.active === 'ElECTION' ? activeStyle : {}} 
                                        onClick={() => this._handleClick('ElECTION')} 
                                        to='/election' >
                                        ElECTION
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        style={this.state.active === 'TDD' ? activeStyle : {}} 
                                        onClick={() => this._handleClick('TDD')} 
                                        to='/tdd' >
                                        TDD
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </header>
                    <div className='App-intro'>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/dream-stakes' component={Lottery} />
                            <Route path='/auction' component={Auction} />
                            <Route path='/election' component={Election} />
                            <Route path='/tdd' component={Tdd} />
                            <Redirect to='/' />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;