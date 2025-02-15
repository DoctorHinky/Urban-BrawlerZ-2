import Home from "./Components/Home/Home";
import { ModeProvider } from "./Context/GameMode";
import Selection from "./Components/Menus/Selection";
function App() {
  return (
    <>
      <ModeProvider>
        <Home />
      </ModeProvider>
    </>
  );
}

export default App;
