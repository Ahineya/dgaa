import './app.scss';
import {useClickOutside, useWindowResize} from "@dgaa/native-event-hooks";
import {useRef, useState} from "react";

const Component = () => {
  const [show, setShow] = useState(false);

  useClickOutside('.something-another', () => {
    console.log('Clicked outside by selector', show);
    setShow(false);
  }, [show]);

  return (
    <div>
      <button className="something-another" onClick={() => setShow(true)}>Toggle</button>
      {show && <div className="something-another">Click outside me</div>}
    </div>
  );
};

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

      <Component />
    </div>
  );
}

export default App;
