import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import { onSnapshot } from 'firebase/firestore';

export default function AddItem() {
  const [userToken] = useState(getUser());
  const [itemName, setItemName] = useState('');
  const [frequency, setFrequency] = useState(7);
  const [message, setMessage] = useState('');
  const [docs, setDocs] = useState([]);

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

  const submitHandler = async (e) => {
    e.preventDefault();

    const cleanList = docs.map((listItem) =>
      listItem
        .data()
        .item.replace(/[^a-zA-Z\s]/g, '')
        .replace(/\s+/g, ' ')
        .toLowerCase(),
    );

    const cleanItemName = itemName
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();

    try {
      if (cleanList.includes(cleanItemName)) {
        setMessage(`${itemName} already included in the list.`);
        throw Error(`${itemName} is already included in the list.`);
      }
      const docRef = await addDoc(collection(db, userToken), {
        item: itemName,
        frequency: frequency,
        lastPurchaseDate: null,
      });
      console.log(docRef.id);
      setMessage(`${itemName} added to the list successfuly.`);
    } catch (e) {
      console.error(e);
    }
    setItemName('');
    setFrequency(7);
  };

  return (
    <>
      <h1>Add Item</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="item-name">Item name:</label>
        <input
          required
          id="item-name"
          type="text"
          name="item-name"
          onChange={(e) => setItemName(e.target.value)}
          value={itemName}
        />
        <fieldset>
          <legend>How soon will you buy this again?</legend>
          <input
            defaultChecked
            id="soon"
            type="radio"
            name="frequency"
            value={7}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <label htmlFor="soon">Soon</label>
          <input
            id="kind-of-soon"
            type="radio"
            name="frequency"
            value={14}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <label htmlFor="kind-of-soon">Kind of Soon</label>
          <input
            id="not-soon"
            type="radio"
            name="frequency"
            value={30}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <label htmlFor="not-soon">Not Soon</label>
        </fieldset>
        <button type="submit">Add Item</button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}
