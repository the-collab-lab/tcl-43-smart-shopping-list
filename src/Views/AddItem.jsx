import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AddItem() {
  const submitHandler = async () => {
    try {
      const docRef = await addDoc(collection(db, 'Shopping-List'), {
        item: 'banana',
      });
      console.log(docRef.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div>
        <button onClick={submitHandler}>Click to submit new item</button>
      </div>
    </>
  );
}
