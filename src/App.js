import Board from "./componets/Board";
import Toolbox from "./componets/Toolbox";
import Boardprovider from "./store/Boardprovider";

function App() {
  return (
   <Boardprovider>
      <Toolbox />
      <Board />
    
    </Boardprovider>
  );
}

export default App;
