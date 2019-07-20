
export const LOTTERY_ERROR = 'LOTTERY_ERROR';
export const LOTTERY_W_J_T_S = 'LOTTERY_W_J_T_S';
export const LOTTERY_UPDATE_WINNER = 'LOTTERY_UPDATE_WINNER';
export const LOTTERY_SET_SCRATCHER = 'LOTTERY_SET_SCRATCHER';
export const LOTTERY_UPDATE_DREAM_BANK = 'LOTTERY_UPDATE_DREAM_BANK';
export const UPDATE_JACKPOT = 'UPDATE_JACKPOT';

import {Backend_EndPoint} from '../constants';
import { ApiProvider } from '../ApiProvider';

export const defaultState = {
    lastWinningNumber: [0, 0, 0, 0, 0, 0],
    jackpot: {_id: 0, value: 0},
    ticketList: [],
    balance: 0,
    scratcherNumbers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    scratcherList: [],
    error: null,
};

export function loadWinningJackpotTicketScratcher() {
  return async (dispatch, getState) => {
    try {
        var lastWinningNumber = await ApiProvider(Backend_EndPoint + "api/lottery/lastWinningNumber/", "GET", null);
        var jackpot = await ApiProvider(Backend_EndPoint + "getJackpot/", "GET", null);
        var ticketList = await ApiProvider(Backend_EndPoint + "api/lottery/getPickData/", "GET",null);
        var scratcherNumbers = await ApiProvider(Backend_EndPoint + "api/lottery/getScratcherNumber/", "GET", null);
        var scratcherList = await ApiProvider(Backend_EndPoint + "api/lottery/getScratcherWinnerData/", "GET", null);
        var balance = await ApiProvider(Backend_EndPoint + "api/lottery/getDreamBankBalance", "GET", null);
        
        dispatch({
            type: LOTTERY_W_J_T_S,
            payload: {
                lastWinningNumber: lastWinningNumber.payload?lastWinningNumber.payload.winingNumbers:[0, 0, 0, 0, 0, 0],
                jackpot: jackpot.payload[0],
                ticketList: ticketList.payload,
                scratcherNumbers: scratcherNumbers.payload?scratcherNumbers.payload.originalWiningNumbers:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                scratcherList: scratcherList.payload,
                balance: balance.payload,
            }
        });
    } catch (error) {
      dispatch({
        type: LOTTERY_ERROR,
        payload: error
      });
    };
  };
}
export function setWinnerNumber(params) {

    return async (dispatch, getState) => {
        try {
            var winningNumbers = await ApiProvider(Backend_EndPoint + "api/lottery/setWinnerNumber", "POST", params);
            dispatch({
                type: LOTTERY_UPDATE_WINNER,
                payload: {
                    lastWinningNumber: winningNumbers.payload.winingNumbers,
                }
            });        
        } catch (error) {
            dispatch({
                type: LOTTERY_ERROR,
                payload: error
            });
        };
    };
}

export function saveJackPot(id, value) {

    return async (dispatch, getState) => {
        try {
            await ApiProvider(Backend_EndPoint + "setJackpot", "POST", {id, value});
            dispatch({
                type: UPDATE_JACKPOT,
                payload: {
                    jackpot: {
                        _id: id,
                        value
                    },
                }
            });
        } catch (error) {
            dispatch({
                type: LOTTERY_ERROR,
                payload: error
            });
        };
    };
}

export function setScratcherNumber(winingNumbers) {

    return async (dispatch, getState) => {
        try {
            await ApiProvider(Backend_EndPoint + "api/lottery/setScratcherNumber", "POST", {winingNumbers});
            var scratcherList = await ApiProvider(Backend_EndPoint + "api/lottery/getScratcherWinnerData/", "GET", null);

            dispatch({
                type: LOTTERY_SET_SCRATCHER,
                payload: {
                    scratcherList: scratcherList.payload,
                }
            });
        } catch (error) {
            dispatch({
                type: LOTTERY_ERROR,
                payload: error
            });
        };
    };
}

export function saveDreamBank(balance) {

    return async (dispatch, getState) => {
        try {
            console.log({balance})
            await ApiProvider(Backend_EndPoint + "api/lottery/updateDreamBankBalance", "POST", {balance});
            dispatch({
                type: LOTTERY_UPDATE_DREAM_BANK,
                payload: {
                    balance: balance,
                }
            });
        } catch (error) {
            dispatch({
                type: LOTTERY_ERROR,
                payload: error
            });
        };
    };
}

