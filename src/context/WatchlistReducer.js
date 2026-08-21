import { ACTIONS } from '../globals/globalVariables';

function watchlistReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_WATCHLIST:
      return action.payload;
    case ACTIONS.ADD_MOVIE:
      return [...state, action.payload];
    case ACTIONS.REMOVE_MOVIE:
      return state.filter((movie) => movie.id !== action.payload);
    default:
      return state;
  }
}

export default watchlistReducer;
