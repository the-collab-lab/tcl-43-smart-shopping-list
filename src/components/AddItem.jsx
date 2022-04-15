import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AddItem(userToken) {
  // Accept a prop called newToken that should be a string
  // Utilize AddItem component to create new collection in FireStore db for that specific user.
  // user token should populate in FireBase database with new collection
  console.log('AddItem token received =>', userToken);
  console.log('typeof:', typeof userToken);

  // This is the last task ==>
  // It worked before with "Shopping-List" as argument but not working anymore..
  // Unable to create new collection in database with newToken as is >>>
  const submitHandler = async () => {
    try {
      const docRef = await addDoc(collection(db, userToken), {
        item: 'test value',
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
