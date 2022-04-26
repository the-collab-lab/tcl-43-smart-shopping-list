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

export default function List() {
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());

  const handleCheckBox = (e, item) => {
    e.preventDefault();
    let now = Timestamp.now().seconds;
    const docItem = doc(db, userToken, item.id);
    updateDoc(docItem, {
      lastPurchaseDate: now,
    });
  };

  const check24Hrs = (item) => {
    let now = Timestamp.now().seconds;
    let itemPurchaseDate = item.data().lastPurchaseDate;
    let difference = now - itemPurchaseDate;
    // We are using 86400 which is 24 hours in seconds since `now` is also in seconds
    if (difference < 86400) {
      return true;
    }
    return false;
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
        <ul>
          {docs.map((item, index) => {
            return (
              <li key={index}>
                <input
                  aria-label="checkbox for purchased item"
                  id={item.data().id}
                  type="checkbox"
                  onChange={(e) => handleCheckBox(e, item)}
                  checked={check24Hrs(item)}
                  disabled={check24Hrs(item)}
                />
                {item.data().item}
              </li>
            );
          })}
        </ul>
      </div>

      <Nav />
    </>
  );
}
