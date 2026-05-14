import { act, createContext } from "react";

const BoardContext = createContext({
  activeTool: "RECTANGLE",
  toolActionType: "NONE",
  element: [],

  boardMouseDownHandler: () => {},
  boardMouseMoveHandler: () => {},
  changeToolHandler: () => {},
  boardMouseUPHandler: () => {},

});

export default BoardContext;
