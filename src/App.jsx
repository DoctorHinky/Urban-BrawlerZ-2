import Home from "./Components/Home/Home";
import { ModeProvider } from "./Context/GameMode";
import Canvas from "./Components/Canvas/Canvas";
function App() {
  return (
    <div>
      <ModeProvider>
        <Canvas />
      </ModeProvider>
    </div>
  );
}

export default App;
