import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

export default function List() {
  //states:
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());
  const navigate = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleCheckBox = (e, item) => {
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

    lastPurchase === null
      ? Math.round((now - itemCreated) / 86400)
      : Math.round((now - lastPurchase) / 86400);
  };

  const daysUntilNextPurchase = (item) => {
    return item.data().estimatedPurchaseInterval - daysSinceLastPurchase(item);
  };

  const isActive = (item) => {
    return (
      item.data().totalPurchases > 1 &&
      daysSinceLastPurchase(item) < item.data().estimatedPurchaseInterval * 2
    );
  };

  const determinePurchaseCategory = (item) => {
    console.log('name: ', item.data().item);
    console.log('Days since last purchase: ', daysSinceLastPurchase(item));
    console.log(
      'estimated purchase interval: ',
      item.data().estimatedPurchaseInterval,
    );
    console.log('days until next purchase: ', daysUntilNextPurchase(item));

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

  const sortList = (docs) => {
    docs.sort(function (a, b) {
      if ((isActive(a) && isActive(b)) || (!isActive(a) && !isActive(b))) {
        return daysUntilNextPurchase(a) - daysUntilNextPurchase(b);
      }

      if (isActive(a)) {
        return -1;
      } else {
        return 1;
      }
    });
  };

  useEffect(() => {
    const listRef = collection(db, userToken);
    const q = query(listRef, orderBy('item'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let snapshotDocs = [];

      snapshot.forEach((doc) => snapshotDocs.push(doc));
      setDocs(sortList(snapshotDocs));
    });
    return () => {
      unsubscribe();
    };
  }, [userToken]);

  return (
    <>
      <h1>Shopping List</h1>
      {docs.length === 0 ? (
        <div>
          <p>Your shopping list is currently empty</p>
          <button
            onClick={() => {
              navigate('/addItem');
            }}
          >
            Add Item
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchInputValue}
            onChange={(e) => {
              setSearchInputValue(e.target.value);
            }}
          />

          <button onClick={() => setSearchInputValue(() => '')}>Reset</button>

          <ul>
            {docs
              .filter((item) => {
                return item
                  .data()
                  .item.toLowerCase()
                  .includes(searchInputValue.toLowerCase());
              })

              .map((item, index) => {
                return (
                  <li key={index}>
                    <label
                      className={determinePurchaseCategory(item)}
                      aria-label={`next purchase is ${determinePurchaseCategory(
                        item,
                      )}`}
                    >
                      <input
                        aria-label="checkbox for purchased item"
                        id={item.data().id}
                        type="checkbox"
                        onChange={(e) => handleCheckBox(e, item)}
                        checked={wasPurchasedWithin24Hours(item)}
                        disabled={wasPurchasedWithin24Hours(item)}
                      />
                      <span></span>
                    </label>
                    {item.data().item}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      <Nav />
    </>
  );
}
