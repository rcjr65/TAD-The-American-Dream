
export const ELECTION_ERROR = 'ELECTION_ERROR';
export const ELECTION_SET_PEROID = 'ELECTION_SET_PEROID';
export const ELECTION_GET_DATA = 'ELECTION_GET_DATA';

import {Backend_EndPoint} from '../constants';
import { ApiProvider } from '../ApiProvider';

export const defaultState = {
    startDate: new Date(),
    endDate: new Date(),
    electionResult: [],
    error: null,
};

export function loadData() {
    return async (dispatch, getState) => {
        try {
            var electionDate = await ApiProvider(Backend_EndPoint + 'api/election/getElectionPeriod', 'GET', null);
            var electionResult = await ApiProvider(Backend_EndPoint + 'api/election/result', 'GET', null);
                        
            dispatch({
                type: ELECTION_GET_DATA,
                payload: {
                    startDate: new Date(electionDate.payload[0].startTime * 1000),
                    endDate: new Date(electionDate.payload[0].endTime * 1000),
                    electionResult: electionResult.payload,
                }
            });
        } catch (error) {
            dispatch({
                type: ELECTION_ERROR,
                payload: error
            });
        };
    };
}
export function setPeriod(params) {
    return async (dispatch, getState) => {
        try {
            var electionDate = await ApiProvider(Backend_EndPoint + 'api/election/setElectionPeriod', 'POST', params);
            dispatch({
                type: ELECTION_SET_PEROID,
                payload: {
                    startDate: params.startTime,
                    endDate: params.endTime,
                }
            });
        } catch (error) {
            dispatch({
                type: ELECTION_ERROR,
                payload: error
            });
        };
    };
}