## Cache flex
An in-memory cache with extra options to fix value types and set constants in cache, for more consistency.

### Methods

#### *.set(key, value)*
- `value` can be anything except for undefined, null or NaN.
- Returns a **promise** that resolves with the set value.
- ***.setSync(...)*** is the synchronous version with the same parameters, returns the value.

#### *.setFixType(key, value)*
- fixes the type for the `value` against the given `key`, and
can be only updated with a `value` with same type as inital type of `value`.
- Returns a **promise** that resolves with the set value.
- ***.setFixTypeSync(...)*** is the synchronous version with the same parameters, returns the value.

#### *.setConstant(key, value)*
- sets the value as a constant i.e. the value cannot be changed later on.
- Returns a **promise** that resolves with the set value.
- ***.setConstantSync(...)*** is the synchronous version with the same parameters, returns the value.

#### *.get(key)*
- Returns a **promise** that resolves with the value stored against the `key`.
- ***.getSync(...)*** is the synchronous version with the same parameters, returns the value.

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
