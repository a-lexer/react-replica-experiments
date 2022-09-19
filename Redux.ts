/**
 * Mini Redux implementation. Built with reference to https://redux.js.org/api/
 */

type State = any;
type Action = { [val: string]: string };
type Reducer = (arg0: State, arg1: Action) => State;
type Dispatch = (arg0: Action) => State;
interface Listener { notify: (state: State) => any };

type Store = {
  dispatch: Dispatch
  getState: () => State
  subscribe: (listener: () => void) => () => void
  replaceReducer: (reducer: Reducer) => void
}

/**
 * 
 * @param reducer -> updates the global state value
 * @param initialState 
 * @returns 
 */
const createStore = (reducer: Reducer, initialState: State) => {

  let state: State = undefined;
  let listeners: Listener[] = [];
  let dispatchMiddleware: (() => any)[] = [];

  state = initialState;

  return {
    getState(): State {
      /**
       * Prevent state from being modified by reference by caller.
       */
      return Object.freeze(state);
    },
    dispatch(action: Action): State {
      state = reducer(state, action);
      let _listeners = Object.freeze([...listeners]);
      for (let i = 0; i < _listeners.length; i++) {
        _listeners[i].notify(Object.freeze(state));
      }
    },
    subscribe<L extends Listener>(listener: L): any {
      listeners = listeners.concat([listener])
    }
  }
}



/**
 *  -- test examples from react docs go under here
 */


function todos(state = [] as any[], action: Action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

const store = createStore(todos, ['Use Redux'])
store.subscribe({
  notify(currentState: State) {
    console.log('current state is: ', currentState);
    if (currentState.length === 2) {
      store.dispatch({
        type: 'ADD_TODO',
        text: 'Add this too I guess'
      })
    }
  }
})
store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})
console.log(store.getState())


