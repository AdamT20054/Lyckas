/**
 * No-operation
 */
function noop() {
  // noop
}

/**
 * Converts any value to a string
 * @param {*} val
 */
function toString(val) {
  return `${val}`;
}

module.exports = {
  noop,
  toString,
};
