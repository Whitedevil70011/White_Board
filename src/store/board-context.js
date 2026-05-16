import { createContext } from "react";

const BoardContext = createContext({
  activeTool: "RECTANGLE",
  toolActionType: "NONE",
  element: [],
  history:[[]],
  index: 0,

  boardMouseDownHandler: () => {},
  boardMouseMoveHandler: () => {},
  changeToolHandler: () => {},
  boardMouseUPHandler: () => {},
  textAreaBlurHandler: () => {},

});

export default BoardContext;
