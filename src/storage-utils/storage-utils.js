export const USER = 'USER';

// this utility function is for getting the user token from local storage
export function getUser() {
  return JSON.parse(localStorage.getItem(USER));
}

// this utility function is for setting the user token into local storage
export function setUser(userObject) {
  localStorage.setItem(USER, JSON.stringify(userObject));
}
