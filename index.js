
const cache = new Map();
const fixedTypeOnes = new Map();
const constants = [];


const set = function(key, value, options) {
  return new Promise((resolve, reject) => {
    try {
      resolve(setSync(key, value, options));
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
};


const setConstant = function(key, value) {
  return new Promise((resolve, reject) => {
    try {
      resolve(setConstantSync(key, value));
    } catch (exc) {
      reject(exc);
    }
  });
};


const setFixType = function(key, value) {
  return new Promise((resolve, reject) => {
    try {
      resolve(setFixTypeSync(key, value));
    } catch (exc) {
      reject(exc);
    }
  });
};


const unset = function(key) {
  return new Promise((resolve, reject) => {
    try {
      resolve(unsetSync(key));
    } catch (exc) {
      reject(exc);
    }
  });
};

/**
 * ====== SYNCHRONOUS METHODS ======
 */

const setSync = function(key, value, options) {
  checkKey(key);
  checkValue(value);

  const { makeConstant, fixType, ttl, expiryCallback } = options;

  if (ttl && (typeof ttl !== 'number' || ttl <= 0) ) {
  // if (!(ttl && typeof ttl === 'number' && ttl > 0)) {
    throw new Error(
      `Invalid "ttl" value "${ttl}". It should be a number greater than 0.`
    );
  }

  if (expiryCallback && typeof expiryCallback !== 'function') {
    throw new Error(
      `Parameter "expiryCallback" if provided, should be a function.`
    );
  }
  
  if (cache.has(key)) {
    throw new Error(
      `"${key}" is already defined, instead use 'update' or 'setOrUpdate'.`
    );
  }

  cache.set(key, value);

  if (makeConstant === true) {
    constants.push(key);
  } else if (fixType === true) {
    fixedTypeOnes.set(key, typeof value);
  }

  if (ttl) {
    setTimeout(() => {
      let existingValue;

      if (expiryCallback) {
        existingValue = getSync(key);
        unsetSync(key);
        expiryCallback(existingValue);
      } else {
        unsetSync(key);
      }
    }, ttl);
  }

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


const setConstantSync = function(key, value) {
  return setSync(key, value, null, true);
};


const setFixTypeSync = function(key, value) {
  return setSync(key, value, true);
};


const unsetSync = function(key) {
  if (isConstant(key)) {
    throw new Error(`"${key}" cannot be unset as it is a constant.`);
  }

  if (isFixedType(key)) {
    throw new Error(`"${key}" cannot be unset as it is a fixed type.`);
  }

  return cache.delete(key);
};

/**
 * ===== HELPER METHODS =====
 */

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

  if (isConstant(key)) {
    throw new Error(`"${key}" is constant and can not be updated.`);
  } else if (
    isFixedType(key) && typeof value !== fixedTypeOnes.get(key)
  ) {
    throw new Error(`"${key}" cannot be updated with the provided value type.`);
  }
};

const isConstant = key => constants.indexOf(key) !== -1;
const isFixedType = key => fixedTypeOnes.has(key);

/**
 * ===== EXPORTS =====
 */

module.exports = {
  set,
  setSync,
  get,
  getSync,
  update,
  updateSync,
  setOrUpdate,
  setOrUpdateSync,
  setConstant,
  setConstantSync,
  setFixType,
  setFixTypeSync,
  unset,
  unsetSync
};
