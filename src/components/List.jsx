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
  //states:
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [clearSearch, setClearSearch] = useState();
  const [loading, setLoading] = useState(false);

  const handleCheckBox = (e, item) => {
    e.preventDefault();
    let now = Timestamp.now().seconds;
    const docItem = doc(db, userToken, item.id);
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

      if (clearSearch === '') {
        window.location.reload(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [userToken, clearSearch]);

  return (
    <>
      <h1>Shopping List</h1>
      <div>
        {docs.length === 0 && loading ? (
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
              value={clearSearch}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />

            <button onClick={() => setClearSearch(() => '')}>Reset</button>

            <ul>
              {docs
                .filter((item) => {
                  if (searchTerm === '') {
                    return item;
                  } else if (
                    item
                      .data()
                      .item.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return item;
                  }
                })
                .map((item, index) => {
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
          </div>
        )}
      </div>
      <Nav />
    </>
  );
}
