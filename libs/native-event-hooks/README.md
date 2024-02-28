# native-event-hooks

- useClickOutside

`useClickOutside` is a hook that listens to click events outside of a given element or elements.

Usage:

```tsx
import { useClickOutside } from '@dgaa/native-event-hooks';

const Component = () => {
  const ref = useRef(null);

  useClickOutside(ref, () => {
    console.log('Clicked outside by ref');
  });

  return <div ref={ref}>Click outside me</div>;
};
```

```tsx
import { useClickOutside } from '@dgaa/native-event-hooks';

const Component = () => {
  
  // You can pass multiple selectors to listen to
  useClickOutside(['.something', '.something-new'], () => {
    console.log('Clicked outside by selector list');
  });

  // Or just one:
  useClickOutside('.something', () => {
    console.log('Clicked outside by selector');
  });

  return (
    <div>
      <div className="something">Click outside me</div>
      <div className="something-new">Click outside me</div>
    </div>
  );
};
```

By default, useClickOutside executes only once. Pass an array of dependencies as the third argument to make it execute on every deps change.

```tsx
import { useClickOutside } from '@dgaa/native-event-hooks';

const Component = () => {
  const [show, setShow] = useState(false);

  useClickOutside(['.something', '.something-else'], () => {
    console.log('Clicked outside by selector', show);
    setShow(false);
  }, [show]);

  return (
    <div>
      <button className="something-else" onClick={() => setShow(!show)}>Toggle</button>
      {show && <div className="something">Click outside me</div>}
    </div>
  );
};
```

- useWindowResize

`useWindowResize` is a hook that listens to window resize events. It does not perform any throttling or debouncing, so you might want to do that yourself if needed.

Usage:

```tsx
import { useWindowResize } from '@dgaa/native-event-hooks';

const Component = () => {
  useWindowResize((newWidth, newHeight) => {
    console.log(`Window resized. New width: ${newWidth}, New height: ${newHeight}`);
  });

  return <div>Resize the window</div>;
};
```

It supports an optional third argument, an array of dependencies, to execute the callback only when the dependencies change.
