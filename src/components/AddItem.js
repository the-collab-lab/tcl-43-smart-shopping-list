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
        <input required id="item-name" />
        <fieldset>
          <legend>How soon will you buy this again?</legend>

          <input type="radio" id="soon" name="frequency"></input>
          <label htmlFor="soon">Soon</label>

          <input type="radio" id="kind-of-soon" name="frequency"></input>
          <label htmlFor="kind-of-soon">Kind of Soon</label>

          <input type="radio" id="not-soon" name="frequency"></input>
          <label htmlFor="not-soon">Not Soon</label>
        </fieldset>
        <button type="submit">Add Item</button>
      </form>
    </>
  );
}
