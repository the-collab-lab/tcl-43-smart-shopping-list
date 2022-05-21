import { Timestamp } from 'firebase/firestore';

export const USER = 'USER';

// this utility function is for getting the user token from local storage
export function getUser() {
  return JSON.parse(localStorage.getItem(USER));
}

// this utility function is for setting the user token into local storage
export function setUser(userObject) {
  localStorage.setItem(USER, JSON.stringify(userObject));
}

export function wasPurchasedWithin24Hours(item) {
  let now = Timestamp.now().seconds;
  let itemPurchaseDate = item.data().lastPurchaseDate;
  let difference = now - itemPurchaseDate;
  const secondsInDay = 86400;
  return difference < secondsInDay;
}

export function daysSinceLastPurchase(item) {
  let now = Timestamp.now().seconds;
  const lastPurchase = item.data().lastPurchaseDate;
  const itemCreated = item.data().dateItemAdded;

  if (!lastPurchase) {
    return Math.round((now - itemCreated) / 86400);
  }
  return Math.round((now - lastPurchase) / 86400);
}

export function daysUntilNextPurchase(item) {
  return item.data().estimatedPurchaseInterval - daysSinceLastPurchase(item);
}

export function isActive(item) {
  return (
    !wasPurchasedWithin24Hours(item) &&
    item.data().totalPurchases > 0 &&
    daysSinceLastPurchase(item) < item.data().estimatedPurchaseInterval * 2
  );
}
