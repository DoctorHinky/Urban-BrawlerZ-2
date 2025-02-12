import Home from "./Components/Home/Home";
import { ModeProvider } from "./Context/GameMode";
function App() {
  return (
    <div>
      <ModeProvider>
        <Home />
      </ModeProvider>
    </div>
  );
}

export default App;
