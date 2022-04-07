import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState, useEffect } from 'react';

export default function List() {
  // (04-05-2022) docs state initializer below needs to be implemented somewhere..
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Shopping-List'),
      (snapshot) => {
        let snapshotDocs = [];
        // Firestore requires that you loop through the snapshot to access the docs,
        // instead of just setting the snapshot as the value of the state
        snapshot.forEach((doc) => snapshotDocs.push(doc));
        setDocs(snapshotDocs);
      },
    );
    return () => {
      // Used to remove the snapshot listener when the component is unmounted
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div>
        {docs.map((item, index) => {
          return <p key={index}>{item.data().item}</p>;
        })}
      </div>
    </>
  );
}
