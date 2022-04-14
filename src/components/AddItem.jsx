import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AddItem(userToken) {
  // Accept a prop called userToken that should be a string
  // user token should populate in FireBase database with new collection
  const submitHandler = async () => {
    try {
      const docRef = await addDoc(collection(db, userToken), {
        item: '',
      });
      console.log(docRef.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Add Item</h1>
      <div>
        <button onClick={submitHandler}>Click to submit new item</button>
      </div>
    </>
  );
}
