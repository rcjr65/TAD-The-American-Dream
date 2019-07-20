import {
    LOTTERY_W_J_T_S,
    LOTTERY_UPDATE_WINNER,
    LOTTERY_ERROR,
    LOTTERY_SET_SCRATCHER,
    UPDATE_JACKPOT,
    LOTTERY_UPDATE_DREAM_BANK,
    defaultState 
  } from '../actions/lottery';
  
  const lottery = (state = defaultState, action) => {
    switch (action.type) {
        case LOTTERY_W_J_T_S:
            return {
                ...state,
                lastWinningNumber: action.payload.lastWinningNumber,
                jackpot: action.payload.jackpot,
                ticketList: action.payload.ticketList,
                scratcherNumbers: action.payload.scratcherNumbers,
                scratcherList: action.payload.scratcherList,
                balance: action.payload.balance
            };  
        case UPDATE_JACKPOT:
            alert('Success');
            return {
                ...state,
                jackpot: action.payload.jackpot,
            };  
        case LOTTERY_UPDATE_DREAM_BANK:
            alert('Success');
            return {
                ...state,
                balance: action.payload.balance,
            };  
        case LOTTERY_SET_SCRATCHER:
            alert('The numbers were set successfully');
            return {
                ...state,
                scratcherList: action.payload.scratcherList
            };  
        case LOTTERY_UPDATE_WINNER:
            alert('Success')
            return {
                ...state,
                lastWinningNumber: action.payload.lastWinningNumber,
            };  
        case LOTTERY_ERROR:
            alert(action.payload);
            return {
                ...state,
                error: action.payload
            };
        default:
            return state
        }
  };
  
  export default lottery;