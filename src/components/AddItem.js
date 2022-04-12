import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AddItem() {
  const submitHandler = async () => {
    try {
      const docRef = await addDoc(collection(db, 'Shopping-List'), {
        item: 'Lettuce',
      });
      console.log(docRef.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Add Item</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="item-name">Item name:</label>
        <input required id="item-name" type="text" name="item-name" />
        <fieldset>
          <legend>How soon will you buy this again?</legend>

          <label htmlFor="soon">Soon</label>
          <input
            defaultChecked
            id="soon"
            type="radio"
            name="frequency"
            // RT: I think we will want to add a value and have that equal to the numerical value associated with each frequency, i.e. soon will have a value of 7. This will apply to each input element.
          />

          <label htmlFor="kind-of-soon">Kind of Soon</label>
          <input id="kind-of-soon" type="radio" name="frequency" />

          <label htmlFor="not-soon">Not Soon</label>
          <input id="not-soon" type="radio" name="frequency" />
        </fieldset>
        <button type="submit">Add Item</button>
      </form>
    </>
  );
}
