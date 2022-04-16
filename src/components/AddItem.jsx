import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';

export default function AddItem() {
  const [userToken] = useState(getUser());

  const submitHandler = async () => {
    try {
      const docRef = await addDoc(collection(db, userToken), {
        item: 'sunflower',
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
