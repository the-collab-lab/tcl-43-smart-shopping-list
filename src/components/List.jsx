import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';

export default function List() {
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());
  const navigate = useNavigate();

  const handleCheckBox = (e, item) => {
    e.preventDefault();
    let now = Timestamp.now().seconds;
    const docItem = doc(db, userToken, item.id);
    const lastPurchase = item.data().lastPurchaseDate;
    const itemCreated = item.data().dateItemAdded;
    let daysSinceLastTransaction;

    if (lastPurchase === null) {
      daysSinceLastTransaction = (now - itemCreated) / 86400;
    } else {
      daysSinceLastTransaction = (now - lastPurchase) / 86400;
    }

    updateDoc(docItem, {
      lastPurchaseDate: now,
    });
  };

  const wasPurchasedWithin24Hours = (item) => {
    let now = Timestamp.now().seconds;
    let itemPurchaseDate = item.data().lastPurchaseDate;
    let difference = now - itemPurchaseDate;
    const secondsInDay = 86400;
    return difference < secondsInDay;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, userToken), (snapshot) => {
      let snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc));
      setDocs(snapshotDocs);
    });
    return () => {
      unsubscribe();
    };
  }, [userToken]);

  return (
    <>
      <h1>Shopping List</h1>

      <div>
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
          <ul>
            {docs.map((item, index) => {
              return (
                <li key={index}>
                  <input
                    aria-label="checkbox for purchased item"
                    id={item.data().id}
                    type="checkbox"
                    onChange={(e) => handleCheckBox(e, item)}
                    checked={wasPurchasedWithin24Hours(item)}
                    disabled={wasPurchasedWithin24Hours(item)}
                  />
                  {item.data().item}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Nav />
    </>
  );
}
