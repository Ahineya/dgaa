# use-keybinding

A React hook to listen to gloabal keyboard events, with abilities to cancel events inside inputs and assigning keybindings per app state.

## Usage

```tsx
import { useKeybinding } from '@dgaa/use-keybinding';

const Component = () => {
  useKeybinding('Escape', () => {
    console.log('Escape key pressed');
  });

  return (
    <div>
      <input type="text" />
    </div>
  );
};
```

## API

### useKeybinding

```tsx
function useKeybinding(keybinding: string, callback: (e: KeyboardEvent) => void, {
  cancelInInputs = false,
  useInAppStates = ['default'],
  currentAppState = 'default'
}: UseKeybindingOptions = {}, deps: any[] = [])

```

### Examples

#### Cancel in inputs

```tsx
import { useKeybinding } from '@dgaa/use-keybinding';

const Component = () => {
  useKeybinding('Escape', () => {
    console.log('Escape key pressed');
  }, { cancelInInputs: true });

  return (
    <div>
      <input type="text" />
    </div>
  );
};
```

#### Use in app states

```tsx
import { useKeybinding } from '@dgaa/use-keybinding';

const Component = () => {
  
  const [appState, setAppState] = useState('default');
  
  useKeybinding('Escape', () => {
    console.log('Escape key pressed');
  }, { useInAppStates: ['default'], currentAppState: appState }); // Will only work when appState is 'default'

  return (
    <div>
      <input type="text" />
    </div>
  );
};
```
