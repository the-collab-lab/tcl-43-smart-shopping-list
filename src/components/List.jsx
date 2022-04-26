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
    // console.log("NOW: ", now)
    // let dayFromNow = now + 86400
    // console.log("day later: ", dayFromNow);
    const docItem = doc(db, userToken, item.id);
    console.log('ITEM: ', docItem);

    updateDoc(docItem, {
      lastPurchaseDate: now,
    });
  };

  const check24Hrs = (item) => {
    //  have it check the last purchase date for the item
    // take line 15 => run that difference.. eg; now - items purchase date?
    console.log('check 24 item last purchase');
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
                  type="checkbox"
                  onClick={(e) => handleCheckBox(e, item)}
                  checked={check24Hrs(item)}
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
