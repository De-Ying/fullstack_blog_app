// Set a key-value pair in session storage
const setSessionValue = (key, value) => {
  sessionStorage.setItem(key, value);
};

// Retrieve a value from session storage based on the key
const getSessionValue = (key) => {
  return sessionStorage.getItem(key);
};

// Remove a key-value pair from session storage based on the key
const removeSessionValue = (key) => {
  sessionStorage.removeItem(key);
};

// Clear all data stored in session storage (logout user)
const clearSessionStorage = () => {
  sessionStorage.clear();
};

export {
  setSessionValue,
  getSessionValue,
  removeSessionValue,
  clearSessionStorage,
};
