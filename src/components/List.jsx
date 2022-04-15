import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';

export default function List() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    let userToken = getUser();
    console.log('Get new USER LIST: ', userToken);

    const unsubscribe = onSnapshot(collection(db, userToken), (snapshot) => {
      let snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc));
      setDocs(snapshotDocs);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <h1>Shopping List</h1>
      <div>
        {docs.map((item, index) => {
          return <p key={index}>{item.data().item}</p>;
        })}
      </div>
    </>
  );
}
