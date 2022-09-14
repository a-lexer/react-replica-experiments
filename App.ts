/**
 * Initial code: https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/
 * With various updates, experiments, tweaks, and new features (as a learning exercise, mainly)
 */

/**
 * React Singleton.
 */
const myReact = (function AlexReact() {
    let state: any[] = [];
    let effects: (() => any)[] = []
    let stateIndex = 0;
    let effectsIndex = 0;

    return {
        render(Component: any) {
            let comp = Component(); // instantiate a new component, which will run useState() again
            comp.render();
            for (let i = 0; i < effects.length; i++) {
                effects[i](); // call effect
            }
            stateIndex = 0;
            effectsIndex = 0;
            return comp;
        },
        useState(initialState: any) {
            state[stateIndex] = state[stateIndex] || initialState;
            let _stateIndex = stateIndex;
            function setState(newState: any) {
                state[_stateIndex] = newState;
            }
            return [state[stateIndex++], setState];
        },
        useEffect(callback: () => any) {
            effects[effectsIndex++] = callback;
        },
        useRef(initialState: any) {
            /**
             * Sets the reference to simply be an object (which we always access by reference) which is present in the state array
             * and can be mutated.
             */
            return this.useState({ current: initialState })[0]
        },
        useReducer<R>(reducer: (state: any, action: any) => R, initialArg: R) {
            let [currentState, setReducerState] = this.useState(initialArg)
            return [currentState, (dispatchedArgument: any) => { setReducerState(reducer(currentState, dispatchedArgument)) }]
        }
    }
})(); // singleton


function reducer(state: any, action: any) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

/**
 * Just a random component that doesn't do that much.
 * @returns 
 */
function MyComponent() {
    let [count, setCount] = myReact.useState(0); // uses the singleton object to create state
    let [name, setName] = myReact.useState('Alex'); // uses the singleton object to create state
    // myReact.useEffect(() => {
    //     setTimeout(() => console.log(`Count is ${count} and name is ${name}`), 2000);
    // })
    const ref = myReact.useRef('hello world');
    const [state, dispatch] = myReact.useReducer(reducer, { count: 0 });

    return {
        render: () => console.log(count, name, state),
        click: () => {
            setCount(count + 1); ref.current = 'lmao'; dispatch({ type: 'increment' })
        },
        setName: () => { setName(name + ' :) '); ref.current = 'wholesome'; }
    }
}

/**
 * Example
 */
let App = myReact.render(MyComponent); // get back the component, so App is the component with the initial state
App.click()
App = myReact.render(MyComponent);
App.click()
App = myReact.render(MyComponent);
App.setName()
App = myReact.render(MyComponent);
App.click()
App = myReact.render(MyComponent);
App.setName()
App = myReact.render(MyComponent);