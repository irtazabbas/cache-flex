const Promise = require('bluebird');

const cache = new Map();
const fixedTypeOnes = new Map();


const set = function(key, value, fixType) {
  return new Promise((resolve, reject) => {
    try {
      resolve(setSync(key, value, fixType));
    } catch (exc) {
      reject(exc);
    }
  });
};


const update = function(key, value) {
  return new Promise((resolve, reject) => {
    try {
      resolve(updateSync(key, value));
    } catch (exc) {
      reject(exc)
    }
  });
};


const setOrUpdate = function(key, value) {
  return new Promise((resolve, reject) => {
    try {
      resolve(setOrUpdateSync(key, value));
    } catch (exc) {
      reject(exc);
    }
  });
};


const get = function(key) {
  return new Promise((resolve, reject) => {
    try {
      resolve(getSync(key));
    } catch (exc) {
      reject(exc);
    }
  });
}


const setSync = function(key, value, fixType) {
  checkKey(key);
  checkValue(value);

  if (cache.has(key)) {
    throw new Error(
      `"${key}" is already defined, instead use 'update' or 'setOrUpdate'.`
    );
  }

  cache.set(key, value);

  if (fixType === true) fixedTypeOnes.set(key, typeof value);

  return value;
};


const updateSync = function(key, value) {
  checkKey(key);
  checkValue(value);

  if (!cache.has(key)) {
    throw new Error(
      `"${key}" does not exist, instead use 'set' or 'setOrUpdate'.`
    );
  }

  checkIfUpdatable(key, value);

  cache.set(key, value);
  return value;
};


const setOrUpdateSync = function(key, value) {
  checkKey(key);
  checkValue(value);

  checkIfUpdatable(key, value);

  cache.set(key, value);
  return value;
};


const getSync = function(key) {
  checkKey(key);

  return cache.get(key);
};


const checkKey = function(key) {
  if (typeof key !== 'string') {
    throw new Error('"key" is expected to be a string.');
  }

  if (key === '') {
    throw new Error('"key" cannot be an empty string.')
  }
};


const checkValue = function(value) {
  if (!isAcceptable(value)) {
    throw new Error('"value" cannot be undefined/null.');
  }
};


const isAcceptable = function(value) {
  return value !== undefined && value !== null &&
    ((typeof value === 'number' && !isNaN(value)) || true);
};


const checkIfUpdatable = function(key, value) {
  checkKey(key);
  checkValue(value);

  if (fixedTypeOnes.has(key) && typeof value !== fixedTypeOnes.get(key)) {
    throw new Error(`"${key}" cannot be updated with the provided value type.`);
  }
}

module.exports = {
  set,
  setSync,
  get,
  getSync,
  update,
  updateSync,
  setOrUpdate,
  setOrUpdateSync
};
