import { useState } from 'react';
import { Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

export default function ListItem({ item, index }) {
  const [userToken] = useState(getUser());

  const checkboxHandler = (e, item) => {
    e.preventDefault();

    const docItem = doc(db, userToken, item.id);
    let now = Timestamp.now().seconds;
    const totalPurchases = item.data().totalPurchases + 1;

    const daysSinceLastTransaction = daysSinceLastPurchase(item);

    const estimatedPurchaseInterval = calculateEstimate(
      item.data().estimatedPurchaseInterval,
      daysSinceLastTransaction,
      totalPurchases,
    );

    updateDoc(docItem, {
      lastPurchaseDate: now,
      totalPurchases: totalPurchases,
      estimatedPurchaseInterval: estimatedPurchaseInterval,
    });
  };

  const wasPurchasedWithin24Hours = (item) => {
    let now = Timestamp.now().seconds;
    let itemPurchaseDate = item.data().lastPurchaseDate;
    let difference = now - itemPurchaseDate;
    const secondsInDay = 86400;
    return difference < secondsInDay;
  };

  const daysSinceLastPurchase = (item) => {
    let now = Timestamp.now().seconds;
    const lastPurchase = item.data().lastPurchaseDate;
    const itemCreated = item.data().dateItemAdded;

    if (!lastPurchase) {
      return Math.round((now - itemCreated) / 86400);
    }
    return Math.round((now - lastPurchase) / 86400);
  };

  const daysUntilNextPurchase = (item) => {
    return item.data().estimatedPurchaseInterval - daysSinceLastPurchase(item);
  };

  const isActive = (item) => {
    return (
      !wasPurchasedWithin24Hours(item) &&
      item.data().totalPurchases > 0 &&
      daysSinceLastPurchase(item) < item.data().estimatedPurchaseInterval * 2
    );
  };

  const determinePurchaseCategory = (item) => {
    if (!isActive(item)) {
      return 'inactive';
    }

    if (daysUntilNextPurchase(item) < 7) {
      return 'soon';
    } else if (daysUntilNextPurchase(item) <= 30) {
      return 'kinda-soon';
    } else {
      return 'not-soon';
    }
  };

  const deleteHandler = (item) => {
    const deletionConfirmation = window.confirm(
      `Are you sure you'd like to delete ${
        item.data().item
      } from your shopping list?`,
    );
    if (deletionConfirmation) {
      deleteDoc(doc(db, userToken, item.id));
    }
  };

  return (
    <div>
      <li key={index}>
        <label
          className={determinePurchaseCategory(item)}
          aria-label={`next purchase is ${determinePurchaseCategory(item)}`}
        >
          <input
            aria-label="checkbox for purchased item"
            id={item.data().id}
            type="checkbox"
            onChange={(e) => checkboxHandler(e, item)}
            checked={wasPurchasedWithin24Hours(item)}
            disabled={wasPurchasedWithin24Hours(item)}
          />
        </label>
        {item.data().item}
        <button onClick={() => deleteHandler(item)}>delete</button>
      </li>
    </div>
  );
}
