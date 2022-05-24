import JoinExistingList from './JoinExistingList.jsx';
import NewListButton from './newListButton.jsx';

// Added Home container for landing page - check in App.css
// Image
export default function Home() {
  return (
    <>
      <div className="home-container">
        <div>
          <h1>Welcome To Your Smart Shopping List!</h1>
        </div>

        <section>
          <NewListButton />
          <JoinExistingList />
        </section>
      </div>
    </>
  );
}
