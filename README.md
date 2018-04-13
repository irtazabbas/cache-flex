## Cache flex
An in-memory cache with a little more options for control and flexibility.

### Methods

#### *.set(key, value, fixType)*
- `fixType` if true fixes the type for the `value` against the given `key`, and
can be only updated with a `value` with same type as inital type of `value`.
- `value` can be anything except for undefined, null or NaN.
- Returns a **promise** that resolves with the set value.

#### *.setSync(key, value, fixType)*
- Synchronous version of `.set(...)`.

#### *.get(key)*
- Returns a **promise** that resolves with the value stored against the `key`.

#### *.getSync(key)]*
- Synchronous version of `.get(...)`.

#### *.update(key, value)*
- Updates *existing* value against `key` with `value`.
- Returns a **promise** that resolves with the updated value.

#### *.setOrUpdate(key, value)*
- Updates or sets value against `key` with `value`.
- Returns a **promise** that resolves with the updated or set value.

### Usage

```js
const cache = require('cache-flex');

cache.setSync('someKey', 'someValue')
let value = cache.getSync('someKey');

cache.set('someKey', {a: 'some value'})
  .then(value => {
    // 'value' is {a: 'some value'}
    let result = cache.get('someKey')
      .then(result => {
        // 'value' is {a: 'some value'}
      })
      .catch(err => {
        // handle error with 'get'
      });
  })
  .catch(err => {
    // handle error with 'set'
  });
```
