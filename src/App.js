import Board from "./componets/Board";
import Toolbox from "./componets/Toolbox";
import Toolbar from "./componets/Toolbar";
import Boardprovider from "./store/Boardprovider";
import ToolboxProvider from "./store/toolboxprovider";

function App() {
  return (
    <ToolboxProvider>
      <Boardprovider>
        <Toolbar />
        <Toolbox />
        <Board />
      </Boardprovider>
    </ToolboxProvider>
  );
}

export default App;
