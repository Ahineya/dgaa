import {useKeybinding} from "@dgaa/use-keybinding";
import {useState} from "react";

export const UseKeybindingDemo = () => {
  const [appState, setAppState] = useState('default');

  useKeybinding('cmd-s', (e) => {
    console.log('Command + S pressed');

    e.preventDefault();
  });

  useKeybinding('a', (e) => {
    console.log('A pressed');
  }, {
    cancelInInputs: true,
  });

  useKeybinding('b', (e) => {
    console.log('B pressed');
  }, {
    cancelInInputs: true,
    useInAppStates: ['modal'],
    currentAppState: appState
  });

  return (
    <div>
      <h1>UseKeybindingDemo</h1>
      <input type="text" placeholder="Cmd+s works, 'a' does not"/>

      <button onClick={() => setAppState('modal')}>Set app state to modal</button>
      <button onClick={() => setAppState('default')}>Set app state to default</button>
    </div>
  );
}
