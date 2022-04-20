import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';

export default function AddItem() {
  const [userToken] = useState(getUser());
  const [itemName, setItemName] = useState('');
  const [frequency, setFrequency] = useState(7);
  // Step 1:
  // Add a state hook for message which has an initial value of an empty string and we can update that with the error message

  const submitHandler = async (e) => {
    e.preventDefault();

    // NOTE: the user's original input should be what gets saved to the database, so we should not edit the setItemName logic

    // Step 2:
    // need to get the user's existing list from firestore
    // I believe the code/logic is the same from the List.jsx file, lines 11 - 18 - if that is the case, maybe we move that into a helper function as well? Something we can look at to refactor after we get it to work

    // Step 3:
    // iterate (map?) over the list items and normalize the text (toLowerCase(), remove punctuation => we should think about having this normalization be a helper function in the storage-utils folder)
    // assign the normalized list to a new variable
    // idea for helper function:
    // data.toLowerCase().replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "")

    // Step 4:
    // Use the helper function to normalize itemName and assign it to new variable

    try {
      // Step 5:
      // Add an if statement to check if the normalized list includes the normalized itemName - if it DOES (is true), update the message state from line 10 to be the error message to display - if it does NOT (is false), continue with the code below
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

      {/* Step 6: */}
      {/* add in conditional logic for message - if it's not an empty string, display the message */}
    </>
  );
}
