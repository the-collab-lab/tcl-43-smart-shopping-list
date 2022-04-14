export const USER = 'USER';

export function getUser() {
  return JSON.parse(localStorage.getItem(USER));
}

export function setUser(userObject) {
  localStorage.setItem(USER, JSON.stringify(userObject));
}
