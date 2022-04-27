import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';

export default function List() {
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());
  const navigate = useNavigate();

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
          docs.map((item, index) => {
            return <p key={index}>{item.data().item}</p>;
          })
        )}
      </div>

      <Nav />
    </>
  );
}
