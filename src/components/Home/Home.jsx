import JoinExistingList from '../JoinExistingList/JoinExistingList';
import NewListButton from '../NewListButton/NewListButton';
import './Home.css';

// TO DO: Image?
export default function Home() {
  return (
    <div className="home-container">
      <div>
        <h1>Welcome To Your SmartShopping List!</h1>
      </div>
      <section>
        <NewListButton />
        <JoinExistingList />
      </section>
    </div>
  );
}
