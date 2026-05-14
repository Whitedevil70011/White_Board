import React from "react";

import BoardContext from "./board-context";

import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import { CreateRoughElement } from "../Utils/element";
import rough from "roughjs";
const gen = rough.generator();

const CHANGE_TOOL = "CHANGE_TOOL";

const boardReducer = (state, action) => {
  switch (action.type) {
    case CHANGE_TOOL: {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }
    case "ADD_ELEMENT": {
      const { clientX, clientY } = action.payload;
      const newElement = CreateRoughElement(
        state.element.length + 1,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem },
      );

      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        element: [...state.element, newElement],
      };
    }
    case "DRAW_MOVE": {
      const { clientX, clientY } = action.payload;
      if (state.element.length === 0) {
        return state;
      }
      const prevelement = [...state.element];
      const index = prevelement.length - 1;

      const newElement = CreateRoughElement(
        index,
        prevelement[index].x1,
        prevelement[index].y1,
        clientX,
        clientY,
        { type: state.activeToolItem },
      );

      prevelement[index] = newElement;

      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        element: prevelement,
      };
    }
    case "DRAW_UP": {
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    default:
      return state;
  }
};

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.RECTANGLE,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  element: [],
};

function Boardprovider({ children }) {
  const [boardState, dispatch] = React.useReducer(
    boardReducer,
    initialBoardState,
  );

  // const [activeTool, setActiveTool] = React.useState(TOOL_ITEMS.RECTANGLE);
  // const [element, setElement] = React.useState([]);

  const handleTooLItemClick = (tool) => {
    dispatch({ type: CHANGE_TOOL, payload: { tool } });
  };

  const boardMouseDownHandler = (event) => {
    const { clientX, clientY } = event;

    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        clientX,
        clientY,
      },
    });
  };

  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    dispatch({
      type: "DRAW_MOVE",
      payload: {
        clientX,
        clientY,
      },
    });
  };
  const boardMouseUPHandler = (event) => {
    dispatch({
      type: "DRAW_UP",
      payload: {},
    });
  };
  const boardContextValue = {
    activeTool: boardState.activeToolItem,
    toolActionType: boardState.toolActionType,
    element: boardState.element,

    changeToolHandler: handleTooLItemClick,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUPHandler,
  };

  return (
    <BoardContext.Provider value={boardContextValue}>
      {children}
    </BoardContext.Provider>
  );
}

export default Boardprovider;
