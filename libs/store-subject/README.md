# store-subject

## Building

Run `nx build store-subject` to build the library.

## Running unit tests

Run `nx test store-subject` to execute the unit tests via [Jest](https://jestjs.io).

## Usage

```typescript
import { StoreSubject } from '@dgaa/store-subject';

const storeSubject = new StoreSubject(1);

storeSubject.subscribe((currentValue) => {
  console.log(currentValue); // 1
);

storeSubject.next(2); // Will log 2

storeSubject.getValue(); // Will return 2
```
