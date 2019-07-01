import {
    ELECTION_ERROR,
    ELECTION_SET_PEROID,
    ELECTION_GET_DATA,
    ELECTION_EDIT_VOTE,
    defaultState 
  } from '../actions/election';
  
  const election = (state = defaultState, action) => {
    switch (action.type) {          
        case ELECTION_ERROR:
            alert(action.payload);
            return {
                ...state,
                error: action.payload
            };
        case ELECTION_SET_PEROID:
            return {
                ...state,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate
            };
        case ELECTION_GET_DATA:
            return {
                ...state,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,
                electionResult: action.payload.electionResult,
            };
        case ELECTION_EDIT_VOTE:
            return {
                ...state,
                electionResult: action.payload.electionResult,
            };
        default:
            return state
        }
  };
  
  export default election;