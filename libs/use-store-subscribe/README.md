# use-store-subscribe

## Building

Run `nx build use-store-subscribe` to build the library.

## Running unit tests

Run `nx test use-store-subscribe` to execute the unit tests via [Jest](https://jestjs.io).

## Usage

```tsx
// store.ts

class SomeStore {
  public storeSubject = new StoreSubject(1);

  public updateValue(value: number) {
    this.storeSubject.next(value);
  }
}

export const someStore = new SomeStore();
```

```tsx

// Component.tsx

import { useStoreSubscribe } from '@dgaa/use-store-subscribe';
import { someStore } from './store';

const Component = () => {
  const currentValue = useStoreSubscribe(someStore.storeSubject);

  const updateValue = () => {
    someStore.updateValue(currentValue + 1);
  };

  return (
    <div>
      {currentValue}
      <button onClick={updateValue}>Update</button>
    </div>
  );
};

```
