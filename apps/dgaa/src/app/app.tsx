import './app.scss';
import {useClickOutside, useWindowResize} from "@dgaa/native-event-hooks";
import {useRef} from "react";

export function App() {
  const ref = useRef<HTMLDivElement>(null);

  useWindowResize((width, height) => {
    console.log('Window resized', width, height);
  });

  useClickOutside(['.something', '.something-new'], () => {
    console.log('Clicked outside');
  });

  useClickOutside(ref, () => {
    console.log('Clicked outside by ref');
  });

  return (
    <div className="app">
      Hey there

      <div className="something">hey</div>
      <div className="something-new">hey</div>

      <div ref={ref} className="click-outside">Click outside</div>
    </div>
  );
}

export default App;
