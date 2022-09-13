/**
 * Initial code: https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/
 * With various updates, experiments, tweaks, and new features (as a learning exercise, mainly)
 */

/**
 * React Singleton.
 */
const myReact = (function AlexReact() {
    let state: any = null;
    let _comp: any = null;

    return {
        render(Component: any) {
            _comp = Component;
            let comp = MyComponent(); // instantiate a new component, which will run useState() again
            comp.render();
            return comp;
        },
        useState(initialState: any) {
            state = state || initialState;
            function setState(newState: any) {
                state = newState;

                let comp = _comp(); // instantiate a new component, which will run useState() again
                comp.render();
                return comp;

            }
            return [state, setState];
        }
    }
})(); // singleton


/**
 * Just a random component that doesn't do that much.
 * @returns 
 */
function MyComponent() {
    let [count, setCount] = myReact.useState(0); // uses the singleton object to create state
    return {
        render: () => console.log(count),
        click: () => { return setCount(count + 1) }
    }
}

/**
 * Example
 */
let App = myReact.render(MyComponent); // get back the component, so App is the component with the initial state
App = App.click()
App = App.click()
App = App.click()
App = App.click()

