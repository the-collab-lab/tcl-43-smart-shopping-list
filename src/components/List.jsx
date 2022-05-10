import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
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
    const lastPurchase = item.data().lastPurchaseDate;
    const itemCreated = item.data().dateItemAdded;
    const totalPurchases = item.data().totalPurchases + 1;

    let daysSinceLastTransaction;
    if (lastPurchase === null) {
      daysSinceLastTransaction = Math.round((now - itemCreated) / 86400);
    } else {
      daysSinceLastTransaction = Math.round((now - lastPurchase) / 86400);
    }

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
                  <>
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

                      <button onClick={() => deleteHandler(item)}>
                        delete
                      </button>
                    </li>
                  </>
                );
              })}
          </ul>
        </div>
      )}
      <Nav />
    </>
  );
}
