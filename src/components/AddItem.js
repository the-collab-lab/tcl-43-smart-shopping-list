import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState } from 'react';
// When merging to main with Issue #3, we can remove setUser below
import { setUser, getUser } from '../storage-utils/storage-utils';
// When merging to main with Issue #3, we can remove the import below
import { getToken } from '@the-collab-lab/shopping-list-utils';

export default function AddItem() {
  const [itemName, setItemName] = useState('');
  const [frequency, setFrequency] = useState(7);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Lines 17 - 18 are for testing purposes. Once we merge into main with Issue #3, we can remove these two lines
    const newUserToken = getToken();
    setUser(newUserToken);
    // This will remain:
    const userToken = await getUser();
    console.log('GET USER TOKEN FROM LS: ', userToken);

    try {
      const docRef = await addDoc(collection(db, userToken), {
        item: itemName,
        frequency: frequency,
        lastPurchaseDate: null,
      });
      console.log(docRef.id);
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
    </>
  );
}
