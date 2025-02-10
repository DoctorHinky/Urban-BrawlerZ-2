import "./Home.scss";

import OnlineLogo from "../../assets/styles/Images/OnlineLogo";
import Offline from "../../assets/styles/Images/Offline";

function Home() {
  return (
    <main className="home">
      <h1>Urban BrawlerZ 2</h1>
      <section>
        <h2>Wähle deinen Spielmodus</h2>
        <div className="modes-container">
          <div className="modes">
            <OnlineLogo />
            <p>Online</p>
          </div>
          <div className="modes">
            <Offline />
            <p>Offline</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
