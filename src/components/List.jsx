import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import ListItem from './ListItem';

export default function List() {
  //states:
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());
  const navigate = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState('');

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
    return docs;
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
                return <ListItem item={item} index={index} />;
              })}
          </ul>
        </div>
      )}
      <Nav />
    </>
  );
}
