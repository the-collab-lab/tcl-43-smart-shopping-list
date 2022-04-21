import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import { NavLink } from 'react-router-dom';

export default function List() {
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());

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
        {docs.map((item, index) => {
          return <p key={index}>{item.data().item}</p>;
        })}
      </div>

      <nav className="link-div">
        <NavLink
          to="/list"
          style={({ isActive }) =>
            isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
          }
        >
          Shopping List
        </NavLink>

        <NavLink
          to="/addItem"
          style={({ isActive }) =>
            isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
          }
        >
          Add Item
        </NavLink>
      </nav>
    </>
  );
}
