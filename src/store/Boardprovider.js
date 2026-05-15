import React, { useContext } from "react";

import BoardContext from "./board-context";
import ToolboxContext from "./toolboxcontext";

import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import {
  CreateRoughElement,
  getSvgPathFromStroke,
  isPointNearElement,
} from "../Utils/element";

import { getStroke } from "perfect-freehand";

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
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const newElement = CreateRoughElement(
        state.element.length + 1,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem, stroke: stroke, fill: fill, size: size },
      );

      return {
        ...state,
        toolActionType:
          state.activeToolItem === TOOL_ITEMS.ERASER
            ? TOOL_ACTION_TYPES.ERASING
            : TOOL_ACTION_TYPES.DRAWING,
        element: [...state.element, newElement],
      };
    }
    case "DRAW_MOVE": {
      const { clientX, clientY, stroke, fill, size } = action.payload;
      if (state.element.length === 0) {
        return state;
      }
      const prevelement = [...state.element];
      const index = prevelement.length - 1;

      const type = state.activeToolItem;
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
          const newElement = CreateRoughElement(
            index,
            prevelement[index].x1,
            prevelement[index].y1,
            clientX,
            clientY,
            { type: state.activeToolItem, stroke, fill, size },
          );

          prevelement[index] = newElement;

          return {
            ...state,
            toolActionType: TOOL_ACTION_TYPES.DRAWING,
            element: prevelement,
          };

        case TOOL_ITEMS.BRUSH: {
          prevelement[index].points = [
            ...prevelement[index].points,
            [clientX, clientY],
          ];
          prevelement[index].path = new Path2D(
            getSvgPathFromStroke(getStroke(prevelement[index].points)),
          );

          return {
            ...state,
            element: prevelement,
          };
        }
        default:
          break;
      }
    }
    case "DRAW_UP": {
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
      return {
        ...state,
        toolActionType: action.payload.toolActionType,
      };
    }
    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      const newElement = state.element.filter((ele) => {
        return !isPointNearElement(clientX, clientY, ele);
      });

      return {
        ...state,
        element: newElement,
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
  const { toolBoxState } = useContext(ToolboxContext);
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
    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatch({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          toolActionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      dispatch({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
      return;
    }
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        clientX,
        clientY,
        stroke: toolBoxState[boardState.activeToolItem]?.stroke || "#000000",
        fill: toolBoxState[boardState.activeToolItem]?.fill || null,
        size: toolBoxState[boardState.activeToolItem]?.size || 1,
      },
    });
  };

  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatch({
        type: "DRAW_MOVE",
        payload: {
          clientX,
          clientY,
          stroke: toolBoxState[boardState.activeToolItem]?.stroke || "#000000",
          fill: toolBoxState[boardState.activeToolItem]?.fill || null,
          size: toolBoxState[boardState.activeToolItem]?.size || 1,
        },
      });
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatch({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
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
