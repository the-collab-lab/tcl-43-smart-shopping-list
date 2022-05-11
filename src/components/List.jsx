import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUser } from '../storage-utils/storage-utils';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

export default function List() {
  //states:
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());
  const navigate = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleCheckBox = (e, item) => {
    e.preventDefault();

    const docItem = doc(db, userToken, item.id);
    let now = Timestamp.now().seconds;
    const lastPurchase = item.data().lastPurchaseDate;
    const itemCreated = item.data().dateItemAdded;
    const totalPurchases = item.data().totalPurchases + 1;

    let daysSinceLastTransaction;
    if (lastPurchase === null) {
      daysSinceLastTransaction = Math.round((now - itemCreated) / 86400);
    } else {
      daysSinceLastTransaction = Math.round((now - lastPurchase) / 86400);
    }

    const estimatedPurchaseInterval = calculateEstimate(
      item.data().estimatedPurchaseInterval,
      daysSinceLastTransaction,
      totalPurchases,
    );

    updateDoc(docItem, {
      lastPurchaseDate: now,
      totalPurchases: totalPurchases,
      estimatedPurchaseInterval: estimatedPurchaseInterval,
    });
  };

  const wasPurchasedWithin24Hours = (item) => {
    let now = Timestamp.now().seconds;
    let itemPurchaseDate = item.data().lastPurchaseDate;
    let difference = now - itemPurchaseDate;
    const secondsInDay = 86400;
    return difference < secondsInDay;
  };

  /*daysSinceLastPurchase = (now - last purchase date) / 86400 
                      = 30 days ago
estimatedPurchaseInterval = 14 days
daysUntilNextPurchase = estimatedPurchaseInterval - daysSinceLastPurchase
                         14 - 30 = -16
         sort first by DaysUntilNextPurcahse*/
  const determinePurchaseCategory = (item) => {
    const now = Date.now() / 1000;
    const daysSinceLastPurchase = Math.round(
      (now - item.data().lastPurchaseDate) / 86400,
    );
    const daysUntilNextPurchase =
      item.data().estimatedPurchaseInterval - daysSinceLastPurchase;
    console.log('name: ', item.data().item);

    console.log('Days since last purchase: ', daysSinceLastPurchase);
    console.log('days until next purchase: ', daysUntilNextPurchase);

    if (
      item.data().totalPurchases <= 1 ||
      item.data().estimatedPurchaseInterval * 2 <= daysSinceLastPurchase
    ) {
      return 'inactive';
    }

    if (daysUntilNextPurchase < 7) {
      return 'soon';
    } else if (daysUntilNextPurchase <= 30) {
      return 'kinda-soon';
    } else {
      return 'not-soon';
    }
  };

  const sortList = (docs) => {
    const sorted = [];

    // ??? not sure how to do this! The list needs to be sorted by daysUntilNextPurchase (see determinePurchaseCategory() above)

    return sorted;
  };

  useEffect(() => {
    const listRef = collection(db, userToken);
    const q = query(listRef, orderBy('item'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc));

      setDocs(snapshotDocs);
      //once sortList() works we will use:
      //setDocs(sortList(snapshotDocs));
    });
    return () => {
      unsubscribe();
    };
  }, [userToken]);

  return (
    <>
      <h1>Shopping List</h1>
      {docs.length === 0 ? (
        <div>
          <p>Your shopping list is currently empty</p>
          <button
            onClick={() => {
              navigate('/addItem');
            }}
          >
            Add Item
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchInputValue}
            onChange={(e) => {
              setSearchInputValue(e.target.value);
            }}
          />

          <button onClick={() => setSearchInputValue(() => '')}>Reset</button>

          <ul>
            {docs
              .filter((item) => {
                return item
                  .data()
                  .item.toLowerCase()
                  .includes(searchInputValue.toLowerCase());
              })

              .map((item, index) => {
                return (
                  <li key={index}>
                    <label className={determinePurchaseCategory(item)}>
                      <input
                        aria-label="checkbox for purchased item"
                        id={item.data().id}
                        type="checkbox"
                        onChange={(e) => handleCheckBox(e, item)}
                        checked={wasPurchasedWithin24Hours(item)}
                        disabled={wasPurchasedWithin24Hours(item)}
                      />
                      <span></span>
                    </label>
                    {item.data().item}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      <Nav />
    </>
  );
}

/*
PEDAC
Problem: sort doc items according to how soon they should be purchased. Each item should be marked as either needing to be bought soon, kinda soon, not soon or inactive. Items will appear in the list with different colored checkboxes according to which group they belong to and then alphabetically within the group. 


Examples: how to test (maybe include how to edit fields in firestore and what order the list should appear in with those values)

Data Structures: 


Algorithm: 
converts seconds to days
daysSinceLastPurchase = (now - last purchase date) / 86400 
                      = 30 days ago
estimatedPurchaseInterval = 14 days
daysUntilNextPurchase = estimatedPurchaseInterval - daysSinceLastPurchase
                         14 - 30 = -16
         sort first by DaysUntilNextPurcahse

         inactive: if purchaseInterval is out of date
                   if daysSinceLastPurchase is double or more estimatedPurcahseInterval 
                      if totalPurchases <= 1 || 
                      (estimatedPurchaseInterval * 2) <= daysSinceLastPurchase


          soon: if DaysUntilNextPurcahse < 7

          kindaSoon: if DaysUntilNextPurcahse >= 7 && <= 30

          notSoon: if DaysUntilNextPurcahse > 30

sort by item name when collection is fetched
after docs are filtered
map item
  purchaseInterval = determinePurchaseInterval(item)
  purchaseInterval === "soon" && return <li> green 
  purchaseInterval === "kindaSoon" && return <li> blue
  purchaseInterval === "notSoon" && return <li> purple
  purchaseInterval === "inactive" && return <li> grey   

Code:
daysUntilNextPurchase = (Math.round(((Date.now()/1000) - item.data().lastPurchasedate)/86400))         
*/
