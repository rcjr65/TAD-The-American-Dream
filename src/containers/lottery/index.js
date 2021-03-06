import React, { Component } from 'react';
import { connect } from 'react-redux';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faEdit, faSave, faTrash);

import Tickets from '../../components/tickets';
import Scratcher from '../../components/scratcher';
import ScratcherWinners from '../../components/scratcherWinners';
import {loadWinningJackpotTicketScratcher, setWinnerNumber, saveJackPot, setScratcherNumber, saveDreamBank} from '../../actions/lottery';
import '../../css/oswald.css';
import '../../css/open-sans.css';
import '../../css/pure-min.css';
import '../../App.css';
import './style.css';

class Lottery extends Component {
  constructor(props) {
    super(props)
    this.state = {
        winningNumbers: [0, 0, 0, 0, 0, 0],
        isEditJackPot: false,
        isEditDreamBank: false,
        jackpot: 0,
        dreamBank: 0,
        scratcherNumbers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        payout: 0,
        lottoData: []
    }
  }
  componentDidMount() {
    this.props.loadWinningJackpotTicketScratcher();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.jackpot !== this.props.jackpot){
        var _payout = 0
        if(this.state.payout != 0 && this.props.jackpot.value != 0 ){
            _payout = (this.state.payout * nextProps.jackpot.value / this.props.jackpot.value)
        }

        this.setState({jackpot: nextProps.jackpot.value, payout: _payout.toFixed(2)});
    }

    if(nextProps.balance.balance !== this.props.balance.balance){
        this.setState({dreamBank: nextProps.balance.balance})
    }

    if(nextProps.scratcherNumbers !== this.props.scratcherNumbers){
        this.setState({scratcherNumbers: nextProps.scratcherNumbers})
    }

  }

  trClassFormat = (state, rowData, column)=> {
    if(rowData != undefined) {
        var level = this.getTicketLevel(rowData.original.numbers);
        if(level == 6){
            return {style: { backgroundColor : 'red'}};
        }
        else if(level == 5){
            return {style: { backgroundColor : '#464690'}};
        }
        else if( level == 4){
            return {style: { backgroundColor : 'grey'}};
        }
        else{
            return {style: { backgroundColor : 'transparent'}};
        }
    }
    else{
        return {style: { backgroundColor : 'transparent'}};
    }    
  }
  
  getTicketLevel = (ticket) => {
    return this.getMatchingElementCount(ticket, this.state.winningNumbers)
  }

  onChangeScratcher = (event, index) => {
    var arr = this.props.scratcherNumbers;
    arr[index] = event.target.value;
    this.setState({scratcherNumbers: arr});
  }

  setScratcher = async () => {
    var scratcherNumbers = this.state.scratcherNumbers.map(x => parseFloat(x))    
    this.props.setScratcherNumber(scratcherNumbers);
    this.setState({scratcherNumbers})
  }

  setNumbers = () => {
      var arr = [0, 0, 0, 0, 0, 0];
      for (var x = 0; x < 6; x++) {
        arr[x] = parseInt(this.state.winningNumbers[x]);
      }
      if(this.props.ticketList.length == 0){
        alert("You can't set winning numbers since there is no tickets.")
      }
      else{
        var params = {
            winningNumbers: arr,
            winnerData: this.state.lottoData
        }
        this.props.setWinnerNumber(params);
      }
  }

  editJackPot = () =>{
    this.jackpotInput.focus();
    this.setState({isEditJackPot: true})
  }

  saveJackPot = () =>{
        this.props.saveJackPot(this.props.jackpot._id, this.state.jackpot);
        this.setState({isEditJackPot: false});
  }

  editDreamBank = () =>{
    this.dreamBankInput.focus();
    this.setState({isEditDreamBank: true})
  }

  saveDreamBank = () =>{
    this.props.saveDreamBank(this.props.balance.id, this.state.dreamBank);
    this.setState({isEditDreamBank: false});
  }

  getMatchingElementCount(left, right) {
    let clonedLeft = []
    left.forEach(element => {
      clonedLeft.push(parseInt(element))
    })

    let matchedCount = 0
    right.forEach(element => {
      //find matching index
      let matchedIndex = clonedLeft.indexOf(parseInt(element))

      if (matchedIndex !== -1) {
        clonedLeft.splice(matchedIndex, 1)
        matchedCount++
      }
    })

    return matchedCount
  }

  calcPayout = (winningNumbers) => {
    var isLevel = 0;
    var payout = 0;
    var lottoData = [];

    this.props.ticketList.forEach(ticket => {
      let matchingCount = this.getMatchingElementCount(ticket.numbers, winningNumbers)

      if(matchingCount == 6){
        var lv6 = {}
        lv6 = {
            userCode: ticket.userCode,
            payout: parseFloat(this.props.jackpot.value)
        }
        
        lottoData.push(lv6)
      }
      else if (matchingCount == 5){
        var lv5 = {} 
        lv5 = {
            userCode: ticket.userCode,
            payout: parseFloat(this.props.jackpot.value) * 0.1
        }
        
        lottoData.push(lv5)
      }
      else if( matchingCount == 4){
        var lv4 = {} 
        lv4 = {
            userCode: ticket.userCode,
            payout: parseFloat(this.props.jackpot.value) * 0.01
        }
        
        lottoData.push(lv4)
      }
    });

    lottoData.forEach(element => {
        payout = parseFloat(payout) + parseFloat(element.payout)
    });
        
    this.setState({lottoData, payout: payout.toFixed(2)})
  }

  randomizeWinner = () => {
    var arr = [0, 0, 0, 0, 0, 0];
    for (var x = 0; x < 6; x++) {
      arr[x] = (Math.random() * 50).toFixed(0);
    }
    this.calcPayout(arr);
    this.setState({ winningNumbers: arr });
  }

  winningNumberUp = (val)=> {
    var arr = this.state.winningNumbers;
    arr[val] = (parseInt(arr[val], 10) + parseInt(1, 10)) % 51;
    this.calcPayout(arr);
    this.setState({ winningNumbers: arr });
  }

  winningNumberDown = (val)=> {
    var arr = this.state.winningNumbers;
    if (arr[val] > 0) arr[val] = (parseInt(arr[val], 10) - parseInt(1, 10)) % 51;
    else {
      arr[val] = 50;
    }
    this.calcPayout(arr);
    this.setState({ winningNumbers: arr });
  }

  render() {
    // console.log('lottoData => ', this.state.lottoData)
    return (
      <div className='containers'>
        <div className='lottWrapper'>
            <div className='box'>
                <h2>TAD&nbsp;&nbsp;MEGA</h2>
                <div className='row'>
                    <div className='col-md-6'>
                        <Tickets ticketList={this.props.ticketList} trClassFormat={(s, r, c)=>this.trClassFormat(s, r, c)}/>
                    </div>
                    <div className='col-md-6'>
                        <div className='text-align-center'>
                            <div style={{ display: 'inline-block', padding: '5px' }}>
                                <p onClick={() => this.winningNumberUp(0)} style={{ cursor: 'pointer', color: 'white' }} > &#9650; </p>
                                <div className='lotto'>{this.state.winningNumbers[0]}</div>
                                <p onClick={() => this.winningNumberDown(0)} style={{ cursor: 'pointer', color: 'white' }} > &#9660; </p>
                            </div>
                            <div style={{ display: 'inline-block', padding: '5px' }}>
                                <p onClick={() => this.winningNumberUp(1)} style={{ cursor: 'pointer', color: 'white' }} > &#9650; </p>
                                <div className='lotto'>{this.state.winningNumbers[1]}</div>
                                <p onClick={() => this.winningNumberDown(1)} style={{ cursor: 'pointer', color: 'white' }} > &#9660; </p>
                            </div>
                            <div style={{ display: 'inline-block', padding: '5px' }}>
                                <p onClick={() => this.winningNumberUp(2)} style={{ cursor: 'pointer', color: 'white' }} > &#9650; </p>
                                <div className='lotto'>{this.state.winningNumbers[2]}</div>
                                <p onClick={() => this.winningNumberDown(2)} style={{ cursor: 'pointer', color: 'white' }} > &#9660; </p>
                            </div>
                            <div style={{ display: 'inline-block', padding: '5px' }}>
                                <p onClick={() => this.winningNumberUp(3)} style={{ cursor: 'pointer', color: 'white' }} > &#9650; </p>
                                <div className='lotto'>{this.state.winningNumbers[3]}</div>
                                <p onClick={() => this.winningNumberDown(3)} style={{ cursor: 'pointer', color: 'white' }} > &#9660; </p>
                            </div>
                            <div style={{ display: 'inline-block', padding: '5px' }}>
                                <p onClick={() => this.winningNumberUp(4)} style={{ cursor: 'pointer', color: 'white' }} > &#9650; </p>
                                <div className='lotto'>{this.state.winningNumbers[4]}</div>
                                <p onClick={() => this.winningNumberDown(4)} style={{ cursor: 'pointer', color: 'white' }} > &#9660; </p>
                            </div>
                            <div style={{ display: 'inline-block', padding: '5px' }}>
                                <p onClick={() => this.winningNumberUp(5)} style={{ cursor: 'pointer', color: 'white' }} > &#9650; </p>
                                <div className='lotto'>{this.state.winningNumbers[5]}</div>
                                <p onClick={() => this.winningNumberDown(5)} style={{ cursor: 'pointer', color: 'white' }} > &#9660; </p>
                            </div>
                            <br />
                            <button className='btn btn-success'  style={{width: '100px', marginRight: 10}} onClick={() => this.setNumbers()}>SET</button>
                            <button className='btn btn-success'  style={{width: '150px'}} onClick={() => this.randomizeWinner()}>RANDOMIZE</button>
                        </div>
                        <div className='box payout'>
                            <h2>PROJECTED&nbsp;&nbsp;PAYOUT</h2>
                            <div style={{ padding: '5px', textAlign: 'center' }}>
                            <h2><span style={{color:'#d8d51a'}}>$&nbsp;&nbsp;</span>{this.state.payout.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h2>
                            </div>
                        </div>
                        <div className='box payout'>
                            <h2>LAST&nbsp;&nbsp;WINNING&nbsp;&nbsp;NUMBERS</h2>
                            <div style={{ padding: '5px', textAlign: 'center' }}>
                            <h2>{this.props.lastWinningNumber[0]+
                            ', '+this.props.lastWinningNumber[1]+
                            ', '+this.props.lastWinningNumber[2]+
                            ', '+this.props.lastWinningNumber[3]+
                            ', '+this.props.lastWinningNumber[4]+
                            ', '+this.props.lastWinningNumber[5]
                            }</h2>
                            </div>
                        </div> 
                    </div>
                </div>                
            </div>
        </div>
        <div className='scratcherWrapper'>
            <div className='row'>
                <div className="col-md-6">
                    <div className="box col-md-12" style={{marginTop: 0, marginBottom: '30px', marginLeft: 0, marginRight: 0}}>
                        <h2>CURRENT&nbsp;&nbsp;MEGA&nbsp;&nbsp;JACKPOT</h2>
                        <div style={{
                                marginTop: "20px",
                                marginBottom: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                        }}>              
                            <span style={{ fontSize: "30px", color: "white", fontWeight: "bold", marginRight: "5px", textAlign: "left" }}>$</span>
                            <input
                                ref={(input) => { this.jackpotInput = input; }} 
                                value={ this.state.isEditJackPot?this.state.jackpot: this.state.jackpot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                onChange={(event)=>this.setState({ jackpot: event.target.value })}
                                style={{ backgroundColor: "transparent", border: "none", fontSize: "30px", color: "white", fontWeight: "bold", marginRight: "20px", width: "70%", textAlign: "left"}}
                                readOnly={this.state.isEditJackPot?false:true }/>
                            
                            <div onClick={()=>{
                                if(this.state.isEditJackPot)
                                    return this.saveJackPot();
                                else
                                    return this.editJackPot();
                                }}>
                                <FontAwesomeIcon size="lg" color="white" icon={this.state.isEditJackPot?"save":"edit" } />
                            </div>
                        </div>
                    </div>
                    <div className="box col-md-12" style={{margin: 0}}>
                        <h2>DREAM&nbsp;&nbsp;MACHINE&nbsp;&nbsp;BANK</h2>
                        <div style={{
                                marginTop: "20px",
                                marginBottom: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                        }}>              
                            <span style={{ fontSize: "30px", color: "white", fontWeight: "bold", marginRight: "5px", textAlign: "left" }}>$</span>
                            <input
                                ref={(input) => { this.dreamBankInput = input; }} 
                                value={ this.state.isEditDreamBank?this.state.dreamBank: this.state.dreamBank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                onChange={(event)=>this.setState({ dreamBank: event.target.value })}
                                style={{ backgroundColor: "transparent", border: "none", fontSize: "30px", color: "white", fontWeight: "bold", marginRight: "20px", width: "70%", textAlign: "left"}}
                                readOnly={this.state.isEditDreamBank?false:true }/>
                            
                            <div onClick={()=>{
                                if(this.state.isEditDreamBank)
                                    return this.saveDreamBank();
                                else
                                    return this.editDreamBank();
                                }}>
                                <FontAwesomeIcon size="lg" color="white" icon={this.state.isEditDreamBank?"save":"edit" } />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box col-md-6">
                    <h2>DREAM&nbsp;&nbsp;TICKET</h2>
                    <div className="row vertical-center">
                        <div className="col-md-7">
                            <div className='box winners'>
                                <h2>WINNERS</h2>
                                <div style={{ padding: '5px', textAlign: 'center' }}>
                                    <h2>{this.props.scratcherList.length}</h2>
                                </div>
                            </div>
                            <ScratcherWinners scratcherList={this.props.scratcherList}/>
                        </div>
                        <div className="col-md-5">
                            <Scratcher 
                                scratcherNumbers={this.state.scratcherNumbers}
                                onChangeScratcher={(e, value)=>this.onChangeScratcher(e, value)}
                                setScratcher={()=>this.setScratcher()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
    loadWinningJackpotTicketScratcher,
    setWinnerNumber,
    saveJackPot,
    setScratcherNumber,
    saveDreamBank
};

const mapStateToProps = ({lottery}) => ({
    lastWinningNumber: lottery.lastWinningNumber,
    jackpot: lottery.jackpot,
    ticketList: lottery.ticketList,
    scratcherNumbers: lottery.scratcherNumbers,
    scratcherList: lottery.scratcherList,
    balance: lottery.balance,
    error: lottery.error,
});

export default connect(mapStateToProps, mapDispatchToProps)(Lottery);
