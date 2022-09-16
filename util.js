function returnValue(options) {
  return (options.type === "async") ? new Promise((resolve, reject) => { resolve(options.value) }) : options.value;
}

function validOptions(options) {
  if (!options || typeof options !== "object" || Object.keys(options).length === 0) return returnValue(false);
  return returnValue(true);
}

function hasKey(key, options) {
  if (!validOptions(options) || !Object.keys(options).includes(key) || !options[key]) return returnValue(false);
  return returnValue(true);
}

function returnError(action, err) {
  return returnValue({ action, err });
}

module.exports = {
  returnValue,
  validOptions,
  hasKey,
  returnError
}