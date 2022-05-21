import { useState } from 'react';
import { Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../utils/utils';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import {
  wasPurchasedWithin24Hours,
  daysSinceLastPurchase,
  daysUntilNextPurchase,
  isActive,
} from '../utils/utils';

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

  const determinePurchaseCategory = (item) => {
    if (!isActive(item)) {
      return 'inactive';
    }

    if (daysUntilNextPurchase(item) < 7) {
      return 'soon';
    } else if (daysUntilNextPurchase(item) <= 30) {
      return 'kinda-soon';
    }
    return 'not-soon';
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
