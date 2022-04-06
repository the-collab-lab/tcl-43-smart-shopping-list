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
        // Firestore requires that you loop through the snapshot to access the docs,
        // instead of just setting the snapshot as the value of the state
        const snapshotDocs = [];
        snapshot.forEach((doc) => snapshotDocs.push(doc));
        setDocs(snapshotDocs);

        // NOTE: (04-05-2022) Able to locate ID but unable to find values for item ids
        // Bring up in office hours..
        console.log(snapshotDocs.map((docItem) => docItem.id));
      },
    );
    return () => {
      // Used to remove the snapshot listener when the component is unmounted
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div>Hello world</div>
    </>
  );
}
