import { combineReducers } from 'redux';
import home from './home';
import lottery from './lottery';
import auction from './auction';
import election from './election';

const rootReducer = combineReducers({
    home: home,
    lottery: lottery,
    auction: auction,
    election: election,
});
  
export default rootReducer;